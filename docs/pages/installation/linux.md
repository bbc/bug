---
layout: page
title: Linux
parent: Installation
nav_order: 2
---

# Linux

## Install Docker

1. TODO

## Install Docker-Compose

1. TODO

## Create Files

1. Create a file called `docker-compose.yml`
2. Copy the below code snippet into the file

Note - This describes where to get the docker containers needed to run BUG from and how to create them plumbing the right bits and pieces from your system into dockers such as ports and files.

```
# BUG for Windows, Mac or Linux

version: "3.8"

networks:
  bug:
    name: ${DOCKER_NETWORK_NAME}
    driver: bridge

services:
  app:
    image: 172.26.108.110/bug/app:latest
    container_name: ${BUG_CONTAINER}
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logs:/home/node/bug/logs
      - ./config/panels:/home/node/bug/config/panels
      - ./config/global:/home/node/bug/config/global
    env_file:
      - .env
    environment:
      NODE_ENV: 'production'
    hostname: ${BUG_CONTAINER}
    networks:
      - ${DOCKER_NETWORK_NAME}
    ports:
      - ${BUG_PORT}:${BUG_PORT}

  mongo:
    image: mongo:latest
    restart: unless-stopped
    container_name: bug-mongo
    networks:
      - ${DOCKER_NETWORK_NAME}
```

3. Next you need to create a file called `.env` in the same directory as your `docker-compose.yml` file above
4. Copy the below code snippet into your `.env` file and save it.

Note - This environment file contains variables that you might want to adjust when setting up docker initially, here we've provided some sensible defaults to get you going.

```
MODULE_PORT=3200
MODULE_HOME=/home/node/module

DOCKER_NETWORK_NAME=bug

BUG_CONTAINER=bug-app
BUG_PORT=80
BUG_HOST=http://localhost
BUG_LOG_FOLDER=logs
BUG_LOG_NAME=bug
BUG_CONSOLE_LEVEL=debug

BUG_REGISTRY_FQDN=172.26.108.110
BUG_REGISTRY_PASSWORD=A_PASSWORD
BUG_REGISTRY_EMAIL=AN_EMAIL

MONGO_EXPRESS_PORT=3202
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=bugdev

PORT=3000
NODE_ENV=production
SESSION_SECRET=aSecretForYourSessions
```

## Create Folder Structure

1. Next you'll need to have a place to put your log files and configs. Create a folder structure that looks like this

```
.
├── `docker-compose.yml`.       # Docker Compose file created in step 2
├── `.env`                      # Environment file created in step 4
├── config                      # Create a config folder to store bug configs outside the docker container
│   ├── panels                  # Create an empty folder inside `config` to store each panel's configuration
│   ├── global                  # Create an empty folder inside `config` to store global configuration
└── logs                        # Create an empty folder to store the logs
```

## Start BUG

1. Finally, we can now start BUG from the terminal by running `docker-compose up -d` from the directory containing the `docker-compose.yml` file.

Note - This command hands over the contents of the `docker-compose.yml` file to Docker Desktop which launches the containers as described in the file. You'll need to run this command from the directory containing the `docker-compose.yml`

2. BUG should now be available on [http://localhost](http://localhost)
