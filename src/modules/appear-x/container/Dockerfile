FROM node:22-alpine
WORKDIR /home/node/module
COPY src/server/core ./core
COPY src/modules/appear-x/container ./
RUN npm install
CMD ["npm", "run", "development"]