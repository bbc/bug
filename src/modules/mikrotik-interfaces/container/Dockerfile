FROM node:22-alpine

WORKDIR /home/node/bug/src/modules/mikrotik-interfaces/container

# Install only module container dependencies for test execution.
COPY src/modules/mikrotik-interfaces/container/package*.json ./
RUN npm ci

# Module container source under test.
COPY src/modules/mikrotik-interfaces/container ./

# Shared core utilities used by the module during tests.
COPY src/server/core ./core

ENV NODE_ENV=test
