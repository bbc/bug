FROM node:20-alpine

RUN apk add --no-cache python3 make g++ 

WORKDIR /home/node/bug

COPY package*.json ./
COPY src/client/package*.json ./src/client/

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000 3101

CMD [ "npm", "run", "dev" ]