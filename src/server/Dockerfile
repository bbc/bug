FROM node:20-alpine

# 1. Setup
RUN deluser --remove-home node
WORKDIR /home/node/bug

# 2. Install Root Dependencies
# We do this first so code changes don't trigger a fresh npm install
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 3. Copy the entire src tree from your host
# This includes src/server (with core), src/client, and src/modules
COPY src ./src

# 4. Build the Client
WORKDIR /home/node/bug/src/client
RUN npm install --legacy-peer-deps
RUN npm run build

# 5. Move built assets & Clean up
# Create the production client folder and move the build there
RUN mkdir -p /home/node/bug/client && mv dist/* /home/node/bug/client/

# Now remove the raw client and module source code to keep the image slim
WORKDIR /home/node/bug
RUN rm -rf src/client src/modules

# 6. Final execution
ENV NODE_ENV=production

# The server code remains at /home/node/bug/src/server
CMD [ "sh", "-c", "npm run $NODE_ENV" ]