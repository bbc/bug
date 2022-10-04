FROM node:16

RUN deluser --remove-home node

WORKDIR /home/node/bug
COPY . .
RUN npm install

WORKDIR /home/node/bug/client
RUN npm install --legacy-peer-deps

RUN npm run build

WORKDIR /home/node/bug
CMD [ "sh", "-c", "npm run $NODE_ENV" ]