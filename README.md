# BUG (Broadcast Universal Gateway)

![BUG Logo](https://github.com/bbc/bbcnews-bug-core/blob/main/src/client/public/icons/bug-logo-256x256.png?raw=true)

BUG provides management and control of network devices in broadcast environments.

This is the all new version 3.

It's definitely in pre-alpha, so please don't use it yet...

## Development: Docker

For development on your local machine with docker (recommended)

-   Install the latest version of `docker`, `docker-compose`, `node.js` and `npm`.
-   Clone this repository
-   Change directories to the `./src` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src/client` folder of the repository
-   Run `npm install`.
-   Spin up your development instnace with `docker compose up -d`

You can change many of the port parameters, logging locations by setting environment variables in a `.env` file in the root directory.

When developing in docker changes will automatically be relfected in docker using volume mounts and nodemon to reload. Please make sure to `npm install` on your local machine before spinning up the compose project.

## Development: Local Machine

-   Clone the repository
-   Change directories to the `./src` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src/client` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src` folder of the repository
-   Use `npm run development` to run on your local machine.

Note that this method still requires you to have docker on your machine to test functionality like adding and removing panels. You'll also need a locally running MongoDB aswell.

## Production: Linux, Windows and Mac

-   Install docker on your system if it's not already there.
-   If docker-compose is not on your system install it as well.
-   Copy the below YAML into a file called `docker-compose.yml`.
-   Add the environment variables to a file called `.env` in the same directory. See sample environment file below.
-   Run BUG using `docker-compose up -d`.
-   After a few minutes bug will be avalible at `http://localhost:80`

```
# BUG for Windows, Mac or Linux

version: "3.8"

networks:
  bug:
    name: ${DOCKER_NETWORK_NAME}
    driver: bridge

services:
  core:
    image: 172.26.108.110:5000/bug:latest
    container_name: ${DOCKER_CORE_NAME}
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logs:/home/node/bug-core/logs
      - ./config:/home/node/bug-core/config
    env_file:
      - .env
    environment:
      NODE_ENV: 'production'
    hostname: ${DOCKER_CORE_NAME}
    networks:
      - ${DOCKER_NETWORK_NAME}
    ports:
      - ${BUG_CORE_PORT}:${BUG_CORE_PORT}

  mongo:
    image: mongo:latest
    restart: unless-stopped
    container_name: bug-mongo
    networks:
      - ${DOCKER_NETWORK_NAME}
```

## Production: Raspberry Pi 3/4 (Arm CPU Architecture)

-   Install Raspbian on an SD Card.
-   Install Docker.
-   Install Docker Compose.
-   Copy the below YAML into a file called `docker-compose up -d`.
-   Add the environment variables to a file called `.env`. See sample environment file below.
-   Run `docker-compose up -d`.
-   Find BUG on `localhost:80`

```
# BUG for Raspberry Pi 3 and 4

version: "3.8"

networks:
  bug:
    name: ${DOCKER_NETWORK_NAME}
    driver: bridge

services:
  core:
    image: 172.26.108.110:5000/bug:latest
    container_name: ${DOCKER_CORE_NAME}
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logs:/home/node/bug-core/logs
      - ./config:/home/node/bug-core/config
    env_file:
      - .env
    environment:
      NODE_ENV: 'production'
    hostname: ${DOCKER_CORE_NAME}
    networks:
      - ${DOCKER_NETWORK_NAME}
    ports:
      - ${BUG_CORE_PORT}:${BUG_CORE_PORT}

  mongo:
    image: arm7/mongo:latest
    restart: unless-stopped
    container_name: bug-mongo
    networks:
      - ${DOCKER_NETWORK_NAME}
```

## Sample Environment (`.env`) File

```
MODULE_PORT=3200
MODULE_HOME=/home/node/module

DOCKER_CORE_NAME=bug-core
DOCKER_NETWORK_NAME=bug

BUG_CORE_PORT=3101
BUG_CORE_HOST=http://localhost
BUG_CORE_LOG_FOLDER=logs
BUG_CORE_LOG_NAME=bug-core
BUG_CORE_CONSOLE_LEVEL=debug

MONGO_EXPRESS_PORT=3202
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=testing321

PORT=3000
```

## Helpful Docker Tips

### Detaching from the Terminal

Using the flag `-d` with docker-compose detaches the container output stream from the terminal

### Checking BUG status

Verify your containers are running using the `docker ps` command.

### Check individual container outputs

To look at the logs (terminal) of the core container use;

`docker logs bbcnews-bug-core_bug-core_1`

Where `bbcnews-bug-core_bug-core_1` is the name of the container that can be seen from `docker ps`.

### Stop BUG

To stop the bug, all it's services and containers use;

`docker compose down --remove-orphans`
