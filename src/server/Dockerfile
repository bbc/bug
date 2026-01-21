FROM node:20-alpine

# Remove default node user
RUN deluser --remove-home node

WORKDIR /home/node/bug

# copy package manifests
COPY package*.json ./
COPY src/client/package*.json ./src/client/
COPY src/server/package*.json ./src/server/

# install dependencies
RUN npm install --legacy-peer-deps

# copy source code
COPY src ./src

# build client (Vite)
RUN npm run build -w src/client

ENV NODE_ENV=production
ENV BUG_PORT=80

# start server
CMD ["node", "./src/server/bin/bug-prod.js"]
