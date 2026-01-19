FROM node:20-alpine
RUN deluser --remove-home node
WORKDIR /home/node/bug

# install root and workspace dependencies
COPY package*.json ./
COPY src/client/package*.json ./src/client/
COPY src/server/package*.json ./src/server/
RUN npm install --legacy-peer-deps

# copy source code
COPY src ./src

# build the client
WORKDIR /home/node/bug/src/client
RUN npm run build

RUN mv dist build

WORKDIR /home/node/bug
ENV NODE_ENV=production

# start the server directly
CMD [ "node", "./src/server/bin/bug-prod.js" ]