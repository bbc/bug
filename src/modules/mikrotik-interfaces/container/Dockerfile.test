FROM node:22-alpine
WORKDIR /home/node/module
COPY src/server/core ./core
COPY src/modules/mikrotik-interfaces/container ./
RUN npm install
CMD ["npm", "run", "development"]