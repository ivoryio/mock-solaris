import _ from "lodash";
import Promise from "bluebird";
import uuid from "node-uuid";
import moment from "moment";

import * as log from "./logger";
import { calculateOverdraftInterest } from "./helpers/overdraft";
import {
  CustomerVettingStatus,
  DeviceActivityPayload,
  DeviceConsent,
  DeviceConsentPayload,
  MockPerson,
  RiskClarificationStatus,
  ScreeningProgress,
} from "./helpers/types";

let redis;

if (process.env.MOCKSOLARIS_REDIS_SERVER) {
  log.info(`using redis server at ${process.env.MOCKSOLARIS_REDIS_SERVER}`);
  // tslint:disable-next-line: no-var-requires no-implicit-dependencies
  redis = require("redis");
  Promise.promisifyAll(redis.RedisClient.prototype);
  Promise.promisifyAll(redis.Multi.prototype);
} else {
  log.info("using memory for not very persistent persistence");
  // tslint:disable-next-line: no-var-requires
  redis = Promise.promisifyAll(require("redis-mock"));
}

const redisClient = redis.createClient(
  process.env.MOCKSOLARIS_REDIS_SERVER ?? ""
);

redisClient.on("error", (err) => {
  log.error("Error " + err);
});

export const migrate = async () => {
  try {
    await getPerson("mockpersonkontistgmbh");
    throw new Error("during development, we create it every time");
  } catch (error) {
    log.warning("kontistGmbHAccount not found, creating");

    await savePerson({
      salutation: "MR",
      first_name: "Kontist",
      last_name: "GmbH",
      birth_date: "1998-01-01T00:00:00.000Z",
      birth_city: "Copenhagen",
      nationality: "DE",
      employment_status: "FREELANCER",
      birth_country: "DE",
      address: {
        line_1: "Torstraße 177",
        postal_code: "10155",
        city: "Berlin",
        country: "DE",
      },
      fatca_relevant: true,
      email: "kontistgmbh@mocksolaris.example.com",
      mobile_number: "+49123123223",
      id: "mockpersonkontistgmbh",
      identifications: {
        "identify-mock691f4e49fc43b913bd8ede668e187e9a-1509032370615": {
          id: "identify-mock691f4e49fc43b913bd8ede668e187e9a-1509032370615",
          reference: null,
          url: "https://go.test.idnow.de/kontist/identifications/identify-mock691f4e49fc43b913bd8ede668e187e9a-1509032370615",
          status: "successful",
          completed_at: null,
          method: "idnow",
          identificationLinkCreatedAt: "2017-10-26T15:39:31.327Z",
          person_id: "mock691f4e49fc43b913bd8ede668e187e9a",
          startUrl:
            "https://api.test.idnow.de/api/v1/kontist/identifications/identify-mock691f4e49fc43b913bd8ede668e187e9a-1509032370615/start",
          email: "i1@kontist.com",
        },
        "identify-mock691f4e49fc43b913bd8ede668e187e9a-1509032371343": {
          id: "identify-mock691f4e49fc43b913bd8ede668e187e9a-1509032371343",
          reference: null,
          url: null,
          status: "created",
          completed_at: null,
          method: "idnow",
        },
      },
      screening_progress: "SCREENED_ACCEPTED",
      risk_classification_status: "RISK_ACCEPTED",
      customer_vetting_status: "RISK_ACCEPTED",
      transactions: [
        {
          id: "e0492abb-87fd-42a2-9303-708026b90c8e",
          amount: {
            value: 100000,
            currency: "EUR",
          },
          valuta_date: "2017-12-24",
          description: "kauf dir was",
          booking_date: "2017-09-25",
          name: "topping up the dunning account",
          recipient_bic: "SOBKDEBBXXX",
          recipient_iban: "ES0254451416043911355892",
          recipient_name: "Kontist GmbH",
          sender_bic: "SOBKDEBBXXX",
          sender_iban: "DE00000000002901",
          sender_name: "Alexander Baatz Retirement Fund",
        },
        {
          id: "791a0569-333b-473b-8302-edf733afbbe8",
          booking_type: "SEPA_CREDIT_TRANSFER",
          amount: {
            value: -20000,
            currency: "EUR",
          },
          description: "",
          end_to_end_id: null,
          recipient_bic: null,
          recipient_iban: "DE82581382120668019499",
          recipient_name: "Theresa Klemm",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info: null,
          transaction_id: "791a0569-333b-473b-8302-edf733afbbe8",
          name: "bank-mock-transaction-0.887422767891898",
          status: "accepted",
        },
        {
          id: "da3e9312-d3f9-442f-9783-d52f73bf68d2",
          booking_type: "CARD_TRANSACTION",
          amount: {
            unit: "cents",
            currency: "EUR",
            value: -5000,
          },
          description: "Payment",
          recipient_bic: "SOBKDEBBXXX",
          recipient_iban: "DE58110101002263909949",
          recipient_name: "Kontist GmbH",
          sender_bic: "SOBKDEBBXXX",
          sender_name: "Visa_Solarisbank",
          sender_iban: "DE95110101000018501000",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info:
            '{"cards":{"card_id":"572284483d874a4287522bc8785787ac","merchant":{"country_code":"DE","category_code":"7392","name":"Payment","town":"Berlin"},"original_amount":{"currency":"EUR","value":-5000,"fx_rate":1},"pos_entry_mode":"CONTACTLESS","trace_id":"741bd87c-47e8-4abe-a3ec-0e3b798b4040","transaction_date":"2023-03-30","transaction_time":"2023-03-30T13:51:28.966Z","transaction_type":"PURCHASE"}}',
        },
        {
          id: "a4ed0010-b133-4bc8-a7d5-9be94ceddd68",
          booking_type: "CARD_TRANSACTION",
          amount: {
            unit: "cents",
            currency: "EUR",
            value: -3500,
          },
          description: "Payment",
          recipient_bic: "SOBKDEBBXXX",
          recipient_iban: "DE58110101002263909949",
          recipient_name: "Kontist GmbH",
          sender_bic: "SOBKDEBBXXX",
          sender_name: "Visa_Solarisbank",
          sender_iban: "DE95110101000018501000",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info:
            '{"cards":{"card_id":"572284483d874a4287522bc8785787ac","merchant":{"country_code":"DE","category_code":"7392","name":"Payment","town":"Berlin"},"original_amount":{"currency":"EUR","value":-3500,"fx_rate":1},"pos_entry_mode":"CONTACTLESS","trace_id":"6fb0392c-9aa8-4be1-9a5b-2d6ec0e2d0f5","transaction_date":"2023-03-30","transaction_time":"2023-03-30T13:51:49.929Z","transaction_type":"PURCHASE"}}',
        },
        {
          id: "051c1d23-368a-41f3-b977-f55fbaf70c24",
          booking_type: "SEPA_CREDIT_TRANSFER",
          amount: {
            value: -10000,
            currency: "EUR",
          },
          description: "",
          end_to_end_id: null,
          recipient_bic: null,
          recipient_iban: "DE82581382120668019499",
          recipient_name: "Theresa Klemm",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info: null,
          transaction_id: "051c1d23-368a-41f3-b977-f55fbaf70c24",
          name: "bank-mock-transaction-0.23024594254131348",
          status: "accepted",
        },
        {
          id: "0facd7fa-3b04-474e-95f8-52c79abddf33",
          booking_type: "SEPA_CREDIT_TRANSFER",
          amount: {
            value: 7500,
            currency: "EUR",
          },
          description: "",
          end_to_end_id: null,
          recipient_bic: null,
          recipient_iban: "DE58110101002263909949",
          recipient_name: "Kontist",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info: null,
          transaction_id: "0facd7fa-3b04-474e-95f8-52c79abddf33",
          name: "bank-mock-transaction-0.6256815074879258",
          status: "accepted",
        },
      ],
      account: {
        id: "solarisKontistAccountId",
        iban: "DE58110101002263909949",
        bic: "SOBKDEBBXXX",
        type: "CHECKING_BUSINESS",
        person_id: "mockpersonkontistgmbh",
        balance: {
          value: 69000,
        },
        sender_name: "unknown",
        locking_status: "",
        available_balance: {
          value: 69000,
        },
        seizure_protection: null,
        reservations: [],
        fraudReservations: [],
        pendingReservation: {},
        cards: [
          {
            card: {
              id: "572284483d874a4287522bc8785787ac",
              type: "VIRTUAL_VISA_BUSINESS_DEBIT",
              status: "ACTIVE",
              expiration_date: "2026-03-30",
              person_id: "mockpersonkontistgmbh",
              account_id: "solarisKontistAccountId",
              new_card_ordered: false,
              business_id: null,
              representation: {
                line_1: "KONTIST GMBH",
                formatted_expiration_date: "03/26",
                masked_pan: "5349********3775",
              },
            },
            cardDetails: {
              cardNumber: "5349167611073775",
              cvv: "558",
              settings: {
                contactless_enabled: true,
              },
            },
            controls: [],
          },
        ],
      },
      billing_account: {
        id: "mockaccount_billing_id",
        iban: "DE58110101002263909949",
        bic: "SOBKDEBBXXX",
        type: "CHECKING_BUSINESS",
        person_id: "mockpersonkontistgmbh",
        balance: {
          value: 100000,
        },
        sender_name: "unknown",
        locking_status: "",
        available_balance: {
          value: 100000,
        },
      },
      timedOrders: [],
      fraudCases: [],
      queuedBookings: [],
    });

    const mobileNumber = {
      id: "mobileNumberId-mockpersonkontistgmbh-1d0146b4da4782b680dcd0353dbc0c54",
      number: "+12345678",
      verified: true,
    };

    await saveMobileNumber("mockpersonkontistgmbh", mobileNumber);

    await savePerson({
      salutation: "MS",
      first_name: "FirstName",
      last_name: "LastName",
      address: {
        line_1: "Thinslices",
        postal_code: "10155",
        city: "Berlin",
        country: "DE",
        line_2: "",
      },
      contact_address: {
        line_1: "Ostenderstraße",
        line_2: " 70",
        postal_code: "13353",
        city: "Berlin",
        country: "DE",
        state: "BE",
      },
      email: "theresa@klemm.com",
      mobile_number: "+15550101",
      birth_date: "1985-12-14",
      birth_city: "Berlin",
      birth_country: "DE",
      nationality: "DE",
      employment_status: "EMPLOYED",
      tax_information: {
        marital_status: "MARRIED",
      },
      fatca_relevant: false,
      fatca_crs_confirmed_at: "2022-01-01T00:00:00Z",
      terms_conditions_signed_at: "2022-01-01T00:00:00Z",
      data_terms_signed_at: "2022-01-01T00:00:00Z",
      own_economic_interest_signed_at: "2022-01-01T00:00:00Z",
      id: "mock2ae44519fa2cc8e847e21221aa55b718",
      identifications: {
        "97b6f212-1b37-46c9-b25f-02759641e894": {
          id: "97b6f212-1b37-46c9-b25f-02759641e894",
          url: "https://go.test.idnow.de/kontist/identifications/97b6f212-1b37-46c9-b25f-02759641e894",
          createdAt: "2023-03-03T14:46:28.324Z",
          status: "successful",
          completed_at: null,
          method: "idnow",
          startUrl:
            "https://api.test.idnow.de/api/v1/kontist/identifications/97b6f212-1b37-46c9-b25f-02759641e894/start",
          identificationLinkCreatedAt: "2023-03-03T14:46:38.746Z",
          person_id: "mock2ae44519fa2cc8e847e21221aa55b718",
          email: "theresa@klemm.com",
        },
      },
      transactions: [
        {
          id: "791a0569-333b-473b-8302-edf733afbbe8",
          booking_type: "SEPA_CREDIT_TRANSFER",
          amount: {
            value: 20000,
            currency: "EUR",
          },
          description: "",
          end_to_end_id: null,
          recipient_bic: null,
          recipient_iban: "DE82581382120668019499",
          recipient_name: "Theresa Klemm",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info: null,
          transaction_id: "791a0569-333b-473b-8302-edf733afbbe8",
          name: "bank-mock-transaction-0.887422767891898",
          status: "accepted",
        },
        {
          id: "051c1d23-368a-41f3-b977-f55fbaf70c24",
          booking_type: "SEPA_CREDIT_TRANSFER",
          amount: {
            value: 10000,
            currency: "EUR",
          },
          description: "",
          end_to_end_id: null,
          recipient_bic: null,
          recipient_iban: "DE82581382120668019499",
          recipient_name: "Theresa Klemm",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info: null,
          transaction_id: "051c1d23-368a-41f3-b977-f55fbaf70c24",
          name: "bank-mock-transaction-0.23024594254131348",
          status: "accepted",
        },
        {
          id: "799d2ba9-08ad-4d06-88a5-c16a1afc945e",
          booking_type: "SEPA_CREDIT_TRANSFER",
          amount: {
            value: -7500,
            currency: "EUR",
          },
          description: "",
          end_to_end_id: null,
          recipient_bic: null,
          recipient_iban: "DE82581382120668019499",
          recipient_name: "Kontist",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info: null,
          transaction_id: "799d2ba9-08ad-4d06-88a5-c16a1afc945e",
          name: "bank-mock-transaction-0.3289870239672885",
          status: "accepted",
        },
        {
          id: "0facd7fa-3b04-474e-95f8-52c79abddf33",
          booking_type: "SEPA_CREDIT_TRANSFER",
          amount: {
            value: -7500,
            currency: "EUR",
          },
          description: "",
          end_to_end_id: null,
          recipient_bic: null,
          recipient_iban: "DE58110101002263909949",
          recipient_name: "Kontist",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info: null,
          transaction_id: "0facd7fa-3b04-474e-95f8-52c79abddf33",
          name: "bank-mock-transaction-0.6256815074879258",
          status: "accepted",
        },
        {
          id: "491ba2f2-93c2-47c1-9365-3641a770952f",
          booking_type: "CARD_TRANSACTION",
          amount: {
            unit: "cents",
            currency: "EUR",
            value: -5000,
          },
          description: "Purchase",
          recipient_bic: "SOBKDEBBXXX",
          recipient_iban: "DE82581382120668019499",
          recipient_name: "FirstName LastName",
          sender_bic: "SOBKDEBBXXX",
          sender_name: "Visa_Solarisbank",
          sender_iban: "DE95110101000018501000",
          booking_date: "2023-03-30",
          valuta_date: "2023-03-30",
          meta_info:
            '{"cards":{"card_id":"a3c40d4aa59943ccb9bc0443d827e8ca","merchant":{"country_code":"DE","category_code":"7392","name":"Purchase","town":"Berlin"},"original_amount":{"currency":"EUR","value":-5000,"fx_rate":1},"pos_entry_mode":"CONTACTLESS","trace_id":"d8fc5e83-599c-4662-ad1e-23d3a5a207e2","transaction_date":"2023-03-30","transaction_time":"2023-03-30T14:02:49.369Z","transaction_type":"PURCHASE"}}',
        },
      ],
      statements: [],
      queuedBookings: [],
      createdAt: "2023-03-03T14:45:54.884Z",
      fraudCases: [],
      timedOrders: [],
      job_title: "Programmer",
      account: {
        id: "817b55aa12212e748e8cc2af91544ea2kcom",
        iban: "DE82581382120668019499",
        bic: "SOBKDEBBXXX",
        type: "CHECKING_BUSINESS",
        balance: {
          value: 10000,
        },
        available_balance: {
          value: 10000,
        },
        locking_status: "NO_BLOCK",
        locking_reasons: [],
        account_limit: {
          value: 0,
          unit: "cents",
          currency: "EUR",
        },
        person_id: "mock2ae44519fa2cc8e847e21221aa55b718",
        status: "ACTIVE",
        closure_reasons: null,
        seizure_protection: null,
        sender_name: "bank-mock-1",
        reservations: [],
        fraudReservations: [],
        pendingReservation: {},
        cards: [
          {
            card: {
              id: "a3c40d4aa59943ccb9bc0443d827e8ca",
              type: "VIRTUAL_VISA_BUSINESS_DEBIT",
              status: "ACTIVE",
              expiration_date: "2026-03-03",
              person_id: "mock2ae44519fa2cc8e847e21221aa55b718",
              account_id: "817b55aa12212e748e8cc2af91544ea2kcom",
              new_card_ordered: false,
              business_id: null,
              representation: {
                line_1: "MICHAEL JACKSON",
                formatted_expiration_date: "03/26",
                masked_pan: "2702********8335",
              },
            },
            cardDetails: {
              cardNumber: "2702387978048335",
              cardPresentLimits: {
                daily: {
                  max_amount_cents: 500000,
                  max_transactions: 10,
                },
                monthly: {
                  max_amount_cents: 1000000,
                  max_transactions: 100,
                },
              },
              cardNotPresentLimits: {
                daily: {
                  max_amount_cents: 500000,
                  max_transactions: 10,
                },
                monthly: {
                  max_amount_cents: 1000000,
                  max_transactions: 100,
                },
              },
              cvv: "577",
              settings: {
                contactless_enabled: true,
              },
            },
            controls: [],
          },
        ],
      },
      line_1: "Thinslices",
      line_2: "",
      city: "Berlin",
      postal_code: "10155",
      country: "DE",
      screeningProgress: "NOT_SCREENED",
      riskClassificationStatus: "NOT_SCORED",
      customerVettingStatus: "NOT_VETTED",
      screening_progress: "NOT_SCREENED",
      risk_classification_status: "NOT_SCORED",
      customer_vetting_status: "NOT_VETTED",
    });
  }
};

const jsonToPerson = (value) => {
  if (!value) {
    throw new Error("did not find person");
  }

  const person = JSON.parse(value);
  person.transactions = person.transactions || [];
  return person;
};

export const getPerson = async (personId: string): Promise<MockPerson> => {
  const person = await redisClient
    .getAsync(`${process.env.MOCKSOLARIS_REDIS_PREFIX}:person:${personId}`)
    .then(jsonToPerson);
  return augmentPerson(person);
};

export const getTechnicalUserPerson = () => getPerson("mockpersonkontistgmbh");

const addAmountValues = (a, b) => a + b.amount.value;

export const savePerson = async (person, skipInterest = false) => {
  person.address = person.address || { country: null };

  const account = person.account;

  if (account) {
    const transactions = person.transactions || [];
    const queuedBookings = person.queuedBookings || [];
    const reservations = person.account.reservations || [];
    const now = new Date().getTime();
    const transactionsBalance = transactions
      .filter(
        (transaction) => new Date(transaction.valuta_date).getTime() < now
      )
      .reduce(addAmountValues, 0);
    const confirmedTransfersBalance = queuedBookings
      .filter((booking) => booking.status === "accepted")
      .reduce(addAmountValues, 0);
    const reservationsBalance = reservations.reduce(addAmountValues, 0);
    const limitBalance =
      (account.account_limit && account.account_limit.value) || 0;

    if (transactionsBalance < 0 && !skipInterest) {
      calculateOverdraftInterest(account, transactionsBalance);
    }

    account.balance = {
      value: transactionsBalance,
    };

    account.available_balance = {
      // Confirmed transfers amounts are negative
      value:
        limitBalance +
        transactionsBalance +
        confirmedTransfersBalance -
        reservationsBalance,
    };

    person.account = account;
    person.timedOrders = person.timedOrders || [];
  }

  const response = await redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:person:${person.id}`,
    JSON.stringify(person, undefined, 2)
  );

  return response;
};

export const getTaxIdentifications = async (personId) =>
  JSON.parse(
    (await redisClient.getAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:taxIdentifications:${personId}`
    )) || "[]"
  );

export const saveTaxIdentifications = async (personId, data) =>
  redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:taxIdentifications:${personId}`,
    JSON.stringify(data, undefined, 2)
  );

export const getMobileNumber = async (personId) =>
  JSON.parse(
    await redisClient.getAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:mobileNumber:${personId}`
    )
  );

export const saveMobileNumber = async (personId, data) =>
  redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:mobileNumber:${personId}`,
    JSON.stringify(data, undefined, 2)
  );

export const deleteMobileNumber = async (personId) =>
  redisClient.delAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:mobileNumber:${personId}`
  );

export const getDevice = async (deviceId) =>
  JSON.parse(
    await redisClient.getAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:device:${deviceId}`
    )
  );

export const getAllDevices = () =>
  redisClient
    .keysAsync(`${process.env.MOCKSOLARIS_REDIS_PREFIX}:device:*`)
    .then((keys) => {
      if (keys.length < 1) {
        return [];
      }
      return redisClient.mgetAsync(keys);
    })
    .then((values) => values.map((value) => JSON.parse(value)));

export const getDevicesByPersonId = (personId) =>
  getAllDevices().then((devices) =>
    devices.filter((device) => device.person_id === personId)
  );

export const saveDevice = async (device) =>
  redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:device:${device.id}`,
    JSON.stringify(device, undefined, 2)
  );

export const getDeviceChallenge = async (challengeId) =>
  JSON.parse(
    await redisClient.getAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:deviceChallenge:${challengeId}`
    )
  );

export const deleteDeviceChallenge = async (challengeId) =>
  redisClient.delAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:deviceChallenge:${challengeId}`
  );

export const saveDeviceChallenge = async (challenge) =>
  redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:deviceChallenge:${challenge.id}`,
    JSON.stringify(challenge, undefined, 2)
  );

export const saveBooking = (accountId, booking) => {
  return findPersonByAccountId(accountId)
    .then((person) => {
      person.transactions.push(booking);
      return person;
    })
    .then(savePerson);
};

export const getAllPersons = (): Promise<MockPerson[]> => {
  return redisClient
    .keysAsync(`${process.env.MOCKSOLARIS_REDIS_PREFIX}:person:*`)
    .then((keys) => {
      if (keys.length < 1) {
        return [];
      }
      return redisClient.mgetAsync(keys);
    })
    .then((values) => values.map(jsonToPerson))
    .then((values) =>
      values.sort((p1, p2) => {
        if (!p1.createdAt && p2.createdAt) return 1;
        if (p1.createdAt && !p2.createdAt) return -1;
        if (!p1.createdAt && !p2.createdAt) return 0;
        return p1.createdAt > p2.createdAt ? -1 : 1;
      })
    )
    .then((results) => results.map((person) => augmentPerson(person)));
};

const augmentPerson = (person: MockPerson): MockPerson => {
  const augmented = _.cloneDeep(person);
  augmented.fraudCases = augmented.fraudCases || [];
  augmented.timedOrders = augmented.timedOrders || [];
  augmented.queuedBookings = person.queuedBookings || [];
  augmented.transactions = augmented.transactions || [];

  if (augmented.account) {
    augmented.account.reservations = augmented.account.reservations || [];
    augmented.account.fraudReservations =
      augmented.account.fraudReservations || [];
    augmented.account.pendingReservation =
      augmented.account.pendingReservation || {};
  }
  return augmented;
};

export const getAllIdentifications = () => {
  return getAllPersons().then((persons) => {
    return _.flattenDeep(
      persons.map((person) => {
        const identification: any = Object.values(person.identifications || {});
        identification.person = person;
        return identification;
      })
    );
  });
};

export const findPersonByAccountField = async (findBy) => {
  const persons = await getAllPersons();
  return persons.filter((person) => person.account).find(findBy);
};

export const findPersonByAccountId = (accountId) =>
  findPersonByAccountField(
    (person) =>
      person.account.id === accountId ||
      (person.billing_account || {}).id === accountId
  );

export const findPersonByAccountIBAN = (iban) =>
  findPersonByAccountField((person) => person.account.iban === iban);

export const getWebhooks = async () => {
  const webhooks = await redisClient
    .keysAsync(`${process.env.MOCKSOLARIS_REDIS_PREFIX}:webhook:*`)
    .then((keys) => {
      if (keys.length < 1) {
        return [];
      }
      return redisClient.mgetAsync(keys);
    })
    .then((values) => values.map(JSON.parse));

  return webhooks;
};

export const getWebhookByType = async (type) =>
  (await getWebhooks()).find((webhook) => webhook.event_type === type);

export const getSepaDirectDebitReturns = async () => {
  const sepaDirectDebitReturns = JSON.parse(
    (await redisClient.getAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:sepa_direct_debit_returns`
    )) || "[]"
  );

  return sepaDirectDebitReturns;
};

export const saveSepaDirectDebitReturn = async (sepaDirectDebitReturn) => {
  const sepaDirectDebitReturns = await getSepaDirectDebitReturns();
  sepaDirectDebitReturns.push(sepaDirectDebitReturn);

  log.info(
    "(mockSolaris/saveSepaDirectDebitReturn) Saving Sepa Direct Debit Return",
    sepaDirectDebitReturn
  );

  await redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:sepa_direct_debit_returns`,
    JSON.stringify(sepaDirectDebitReturns)
  );
};

export const saveWebhook = (webhook) => {
  return redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:webhook:${webhook.event_type}`,
    JSON.stringify(webhook, undefined, 2)
  );
};

export const deleteWebhook = (webhookType: string) => {
  return redisClient.delAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:webhook:${webhookType}`
  );
};

export const flushDb = () => {
  return redisClient.flushdbAsync();
};

const fillMissingCurrencyForLegacyBooking = (booking) => ({
  ...booking,
  amount: {
    ...booking.amount,
    currency: booking.amount.currency || "EUR",
  },
});

export const getPersonBookings = (person) => {
  return (person.transactions || []).map(fillMissingCurrencyForLegacyBooking);
};

export const getSmsToken = async (personId: string) => {
  const person = await getPerson(personId);
  return _.get(person, "changeRequest.token", null);
};

export const getCardReferences = async () =>
  JSON.parse(
    (await redisClient.getAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:cardReferences`
    )) || "[]"
  );

export const hasCardReference = async (cardRef) => {
  const cardReferences = await getCardReferences();
  return cardReferences.includes(cardRef);
};

export const saveCardReference = async (cardRef) => {
  if (await hasCardReference(cardRef)) {
    return false;
  }

  const cardReferences = await getCardReferences();
  cardReferences.push(cardRef);
  await redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:cardReferences`,
    JSON.stringify(cardReferences)
  );

  return true;
};

export const getCardData = async (cardId) => {
  const persons = await getAllPersons();

  const cardData = _(persons)
    .map((person) => _.get(person, "account.cards", []))
    .flatten()
    .value()
    .find((cd) => cd.card.id === cardId);

  return cardData;
};

export const getPersonBySpendingLimitId = async (id) => {
  const persons = await getAllPersons();

  const cardData = _(persons)
    .map((person) => _.get(person, "account.cards", []))
    .flatten()
    .value()
    .find(({ controls }) => controls?.find((control) => control.id === id));

  return { person: await getPerson(cardData.card.person_id), cardData };
};

export const getPersonByFraudCaseId = async (
  fraudCaseId
): Promise<MockPerson> => {
  const persons = await getAllPersons();
  return persons.find(
    (p) => p.fraudCases.find((c) => c.id === fraudCaseId) !== undefined
  );
};

export const getCard = async (cardId) => (await getCardData(cardId)).card;

export const getPersonByDeviceId = async (deviceId) => {
  const device = await getDevice(deviceId);
  return getPerson(device.person_id);
};

export const setPersonOrigin = async (personId: string, origin?: string) => {
  await redisClient.setAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:person-origin:${personId}`,
    origin || ""
  );
};

export const createDeviceConsent = async (
  personId: string,
  deviceConsent: DeviceConsentPayload
): Promise<DeviceConsent> => {
  const consent = {
    id: uuid.v4().replace(/-/g, ""),
    person_id: personId,
    event_type: deviceConsent.event_type,
    confirmed_at: deviceConsent.confirmed_at,
    created_at: moment().toISOString(),
  };

  await redisClient.lpushAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:DeviceConsents:${personId}`,
    JSON.stringify(consent)
  );

  return consent;
};

export const getDeviceConsents = async (
  personId: string
): Promise<DeviceConsent[]> => {
  return (
    await redisClient.lrangeAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:DeviceConsents:${personId}`,
      0,
      -1
    )
  ).map((entry) => JSON.parse(entry));
};

export const updateDeviceConsent = async (
  personId: string,
  deviceConsentId: string,
  deviceConsent: DeviceConsentPayload
): Promise<DeviceConsent> => {
  const consents = await getDeviceConsents(personId);
  const index = consents.findIndex((c) => c.id === deviceConsentId);

  if (index < -1) {
    throw new Error("consent not found");
  }

  const consent = {
    ...consents[index],
    ...deviceConsent,
  };

  await redisClient.lsetAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:DeviceConsents:${personId}`,
    index,
    JSON.stringify(consent)
  );

  return consent;
};

export const createDeviceActivity = async (
  personId: string,
  deviceActivity: DeviceActivityPayload
): Promise<void> => {
  const activity = {
    id: uuid.v4().replace(/-/g, ""),
    person_id: personId,
    activity_type: deviceActivity.activity_type,
    device_data: deviceActivity.device_data,
    created_at: moment().toISOString(),
  };

  await redisClient.lpushAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:DeviceActivities:${personId}`,
    JSON.stringify(activity)
  );

  return activity;
};

export const getDeviceActivities = async (personId: string) => {
  return (
    await redisClient.lrangeAsync(
      `${process.env.MOCKSOLARIS_REDIS_PREFIX}:DeviceActivities:${personId}`,
      0,
      -1
    )
  ).map((entry) => JSON.parse(entry));
};

export const getPersonOrigin = async (
  personId: string
): Promise<string | null> => {
  return redisClient.getAsync(
    `${process.env.MOCKSOLARIS_REDIS_PREFIX}:person-origin:${personId}`
  );
};
