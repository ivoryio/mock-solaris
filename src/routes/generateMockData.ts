import * as db from "../db";

export const generateMockData = async (req, res) => {
  await db.savePerson({
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
          value: 3000,
          currency: "EUR",
        },
        valuta_date: "2017-12-24",
        description: "Money added via 5199",
        booking_date: "2017-09-25",
        name: "Money added via 5199",
        recipient_bic: "SOBKDEBBXXX",
        recipient_iban: "ES0254451416043911355892",
        recipient_name: "Kontist GmbH",
        sender_bic: "SOBKDEBBXXX",
        sender_iban: "DE00000000002901",
        sender_name: "Alexander Baatz Retirement Fund",
      },
      {
        id: "e0492abb-87fd-42a2-9303-708026b90c8e",
        amount: {
          value: 20000,
          currency: "EUR",
        },
        valuta_date: "2017-12-24",
        description: "Money added via 5199",
        booking_date: "2017-09-25",
        name: "Money added via 5199",
        recipient_bic: "SOBKDEBBXXX",
        recipient_iban: "ES0254451416043911355892",
        recipient_name: "Kontist GmbH",
        sender_bic: "SOBKDEBBXXX",
        sender_iban: "DE00000000002901",
        sender_name: "Alexander Baatz Retirement Fund",
      },
      {
        id: "e8b88092-c378-43f5-ac8d-1728a1dc716f",
        booking_type: "SEPA_CREDIT_TRANSFER",
        amount: {
          value: 10000,
          unit: "cents",
          currency: "EUR",
        },
        description: "From Michael Patrick",
        end_to_end_id: null,
        recipient_bic: "SOBKDEBBXXX",
        recipient_iban: "DE82581382120668019499",
        recipient_name: "Michael Patrick",
        reference: "referenceId2",
        booking_date: "2023-03-06",
        valuta_date: "2023-03-06",
        meta_info: null,
      },
      {
        id: "d4e31dc0-450a-456d-8b13-ace504b9758a",
        booking_type: "SEPA_CREDIT_TRANSFER",
        amount: {
          value: -7500,
          unit: "cents",
          currency: "EUR",
        },
        description: "To John Braun",
        end_to_end_id: null,
        recipient_bic: null,
        recipient_iban: "DE82581382120668019499",
        recipient_name: "John Braun",
        reference: "referenceId3",
        booking_date: "2023-03-06",
        valuta_date: "2023-03-06",
        meta_info: null,
      },
    ],
    account: {
      id: "solarisKontistAccountId",
      iban: "DE58110101002263909949",
      bic: "SOBKDEBBXXX",
      type: "CHECKING_BUSINESS",
      person_id: "mockpersonkontistgmbh",
      balance: {
        value: 64300,
      },
      sender_name: "unknown",
      locking_status: "",
      available_balance: {
        value: 64300,
      },
      seizure_protection: null,
      reservations: [],
      fraudReservations: [],
      pendingReservation: {},
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
    queuedBookings: [
      {
        id: "cff1e7e4-d9f1-4c95-b983-262a066767d5",
        booking_type: "SEPA_CREDIT_TRANSFER",
        amount: {
          value: -5000,
          unit: "cents",
          currency: "EUR",
        },
        description: "description here 1",
        end_to_end_id: null,
        recipient_bic: null,
        recipient_iban: "DE82581382120668019499",
        recipient_name: "recipient name here",
        reference: "referenceId 1",
        booking_date: "2023-03-06",
        valuta_date: "2023-03-06",
        meta_info: null,
      },
    ],
  });

  await db.savePerson({
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
        id: "e8b88092-c378-43f5-ac8d-1728a1dc716f",
        booking_type: "SEPA_CREDIT_TRANSFER",
        amount: {
          value: -35000,
          unit: "cents",
          currency: "EUR",
        },
        description: "description here 2",
        end_to_end_id: null,
        recipient_bic: null,
        recipient_iban: "DE82581382120668019499",
        recipient_name: "recipient name here",
        reference: "referenceId 2",
        booking_date: "2023-03-06",
        valuta_date: "2023-03-06",
        meta_info: null,
      },
      {
        id: "d4e31dc0-450a-456d-8b13-ace504b9758a",
        booking_type: "SEPA_CREDIT_TRANSFER",
        amount: {
          value: -700,
          unit: "cents",
          currency: "EUR",
        },
        description: "description here 3",
        end_to_end_id: null,
        recipient_bic: null,
        recipient_iban: "DE82581382120668019499",
        recipient_name: "recipient name here",
        reference: "referenceId 3",
        booking_date: "2023-03-06",
        valuta_date: "2023-03-06",
        meta_info: null,
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
        value: -35700,
      },
      available_balance: {
        value: -35700,
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
      overdraftInterest: 20,
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

  res.status(200).send("Mock data generated");
};
