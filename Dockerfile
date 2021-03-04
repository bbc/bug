FROM node:14

WORKDIR /home/node/bug-core

COPY ./src .
RUN npm install package.json

CMD [ "npm", "run", "dev" ]