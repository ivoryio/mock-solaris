FROM node:18

WORKDIR /opt/mockSolaris

EXPOSE 2091

COPY --chown=node:node package.json npm-shrinkwrap.json tsconfig.json ./

RUN npm ci

COPY --chown=node:node src ./src
COPY --chown=node:node tests ./tests

RUN npm run build
RUN rm -R src && rm -R tests

# Run as Non-root
USER node

CMD ["npm", "run", "start"]
