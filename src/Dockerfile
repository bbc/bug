FROM node:14

WORKDIR /home/node/bug-core
COPY . .
RUN npm install

WORKDIR /home/node/bug-core/client
RUN npm install

RUN if [ "x$NODE_ENV" = "xproduction" ]; then npm run build ; fi

WORKDIR /home/node/bug-core
CMD [ "sh", "-c", "npm run $NODE_ENV" ]