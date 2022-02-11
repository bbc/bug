---
layout: page
title: Windows
parent: Installation
nav_order: 2
---

# Windows

## Install Docker

1. Download and install docker desktop for windows, see the [official docker guide](https://docs.docker.com/desktop/windows/install/)

## Create Files

1. Create a file called `docker-compose.yml`. You can create this file anywhere on your system but it's probably simpliest to put it in a new folder all of it's own.

2. Copy the below code snippet into the file

Note - This file describes where to get the docker containers needed to run BUG from and how to create them plumbing the right bits and pieces from your system into dockers such as ports and files.

Note - You may find a text editor such as [Notepad++](https://notepad-plus-plus.org/downloads/) makes the process of creating these configuration files easier.

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
        image: harbor.prod.bcn.bbc.co.uk/bug/app:latest
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
            BUG_PORT: 80
            BUG_HOST: http://localhost
            BUG_LOG_FOLDER: logs
            BUG_LOG_NAME: bug
            BUG_CONSOLE_LEVEL: debug
            BUG_REGISTRY_FQDN: harbor.prod.bcn.bbc.co.uk
            PORT: 3000
            NODE_ENV: production
            SESSION_SECRET: aSecretForYourSessions
        networks:
            - bug
        ports:
            - 80:80
    mongo:
        image: mongo:latest
        restart: unless-stopped
        container_name: bug-mongo
        networks:
            - bug
```

Note - The environment variables in this file are something you might want to adjust when setting up docker initially - here we've provided some sensible defaults to get you going. Not providing environmnet variables will mean they run with a sensible default

## Start BUG

1. Finally, we can now start BUG from the terminal by running `docker compose up -d` from the directory containing the `docker-compose.yml` file.

Note - This command hands over the contents of the `docker-compose.yml` file to Docker Desktop which launches the containers as described in the file. You'll need to run this command from the directory containing the `docker-compose.yml`,

2. BUG should now be available on [http://localhost](http://localhost)

3. You can double check BUG is running by typing `docker ps` into your terminal. Hopefully you'll see something that looks like this;

![docker ps](/assets/images/screenshots/docker-ps.png)

## BUG Folder Structure

When running you're BUG folder structure should look like this;

```
.
├── `docker-compose.yml`.       # Docker Compose file created in step 2
├── config                      # A folder to hold all the BUG configuration
│   ├── panels                  # Each inviduals panel's configuration can be viewed here
│   └── global                  # Global configuration can be viewed here
└── logs                        # You can find all the logs here
```
