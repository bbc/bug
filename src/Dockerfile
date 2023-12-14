FROM node:20-alpine

RUN deluser --remove-home node

WORKDIR /home/node/bug
COPY . .
RUN npm install

WORKDIR /home/node/bug/client
RUN npm install --legacy-peer-deps

RUN npm run build

#We don't need the client node_modules folder after building
RUN rm -r ./node_modules

WORKDIR /home/node/bug

CMD [ "sh", "-c", "npm run $NODE_ENV" ]