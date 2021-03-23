FROM node:14

WORKDIR /home/node/bug-core
COPY . .
RUN npm install -also=dev

WORKDIR /home/node/bug-core/client
RUN npm install -also=dev
# RUN npm run build

WORKDIR /home/node/bug-core
CMD [ "npm", "run", "dev" ]