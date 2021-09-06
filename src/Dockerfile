FROM node:14

WORKDIR /home/node/bug
COPY . .
RUN npm install

WORKDIR /home/node/bug/client
RUN npm install

RUN npm run build

WORKDIR /home/node/bug
CMD [ "sh", "-c", "npm run $NODE_ENV" ]