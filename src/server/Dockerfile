FROM node:20-alpine

# 1. Setup
RUN deluser --remove-home node
WORKDIR /home/node/bug

# 2. Install Root Dependencies
COPY package*.json ./
RUN npm install

# 3. Copy source for the Build Phase
# We need the Core and the Modules (client-side only via .dockerignore)
COPY src/modules ./src/modules
COPY src/client ./src/client

# 4. Build the Client
WORKDIR /home/node/bug/src/client
RUN npm install --legacy-peer-deps

# Build generates the /dist folder inside /home/node/bug/src/client/dist
RUN npm run build

# 5. Clean up Source Code (The "Shrink" Phase)
# We move the static build to a permanent location and delete the raw source
RUN mkdir -p /home/node/bug/client
RUN mv dist/* /home/node/bug/client/
WORKDIR /home/node/bug
RUN rm -rf src/client src/modules

# 6. Final Server Setup
COPY src/server ./src/server

ENV NODE_ENV=production
# Ensure your server script points to /home/node/bug/client for static files
CMD [ "sh", "-c", "npm run $NODE_ENV" ]