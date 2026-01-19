FROM node:20-alpine
RUN deluser --remove-home node
WORKDIR /home/node/bug

# copy manifests to the root
COPY package*.json ./
COPY src/client/package*.json ./src/client/
COPY src/server/package*.json ./src/server/

# install everything at the root level
RUN npm install --legacy-peer-deps

# copy the rest of the source code
COPY src ./src

# build the client from the root using the workspace flag
# this avoids jumping workdirs and keeps paths predictable
RUN npm run build -w src/client

# rename the folder exactly where express api.js expects it
# express root is: /home/node/bug/src/client/build
RUN mv src/client/dist src/client/build

ENV NODE_ENV=production
ENV BUG_PORT=80

# start from the root where node_modules is located
CMD ["node", "./src/server/bin/bug-prod.js"]