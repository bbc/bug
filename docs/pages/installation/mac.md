---
layout: page
title: MacOS
parent: Installation
nav_order: 2
---

# MacOS

## Install Docker

1. Download and install docker desktop for mac, see the [official docker guide](https://docs.docker.com/desktop/mac/install/)

Note - There's a different version for Intel and M1 based macs. You'll need to pick the one suitable for your machine.

## Create Files

1. Create a file called `docker-compose.yml`
2. Copy the below code snippet into the file

Note - This describes where to get the docker containers needed to run BUG from and how to create them plumbing the right bits and pieces from your system into dockers such as ports and files.

Note - You may find a text editor such as [Atom](https://atom.io/) makes the process of creating these configuration files easier.

```
# BUG for Windows, Mac or Linux

version: "3.8"

networks:
    bug:
        name: bug
        driver: bridge

services:
    app:
        container_name: bug
        image: 172.26.108.110/bug/app:latest
        restart: always
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock
          - ./logs:/home/node/bug/logs
          - ./config/panels:/home/node/bug/config/panels
          - ./config/global:/home/node/bug/config/global
        hostname: bug
        environment:
            MODULE_PORT: 3200
            MODULE_HOME: /home/node/module
            DOCKER_NETWORK_NAME: bug
            BUG_CONTAINER: bug
            BUG_PORT: 3101
            BUG_HOST: http://localhost
            BUG_LOG_FOLDER: logs
            BUG_LOG_NAME: bug
            BUG_CONSOLE_LEVEL: debug
            BUG_REGISTRY_FQDN: 172.26.108.110
            PORT: 3000
            NODE_ENV: production
            SESSION_SECRET: aSecretForYourSessions
        networks:
            - bug
        ports:
            - 3000:3000
            - 3101:3101
    mongo:
        image: mongo:latest
        restart: unless-stopped
        container_name: bug-mongo
        networks:
            - bug
```

Note - The environment variables in this file are something you might want to adjust when setting up docker initially - here we've provided some sensible defaults to get you going. Not providing environmnet variables will mean they run with a sensible default

## Create Folder Structure

1. Next you'll need to have a place to put your log files and configs. Create a folder structure that looks like this

```
.
├── `docker-compose.yml`.       # Docker Compose file created in step 2
├── config                      # Create a config folder to store bug configs outside the docker container
│   ├── panels                  # Create an empty folder inside `config` to store each panel's configuration
│   └── global                  # Create an empty folder inside `config` to store global configuration
└── logs                        # Create an empty folder to store the logs
```

## Start BUG

1. Finally, we can now start BUG from the terminal by running `docker compose up -d` from the directory containing the `docker-compose.yml` file.

Note - This command hands over the contents of the `docker-compose.yml` file to Docker Desktop which launches the containers as described in the file. You'll need to run this command from the directory containing the `docker-compose.yml`

2. BUG should now be available on [http://localhost](http://localhost)
