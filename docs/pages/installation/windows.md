---
layout: page
title: Windows
parent: Installation
nav_order: 4
---

# Windows

Unfortunately, Docker for Windows has no support to pass through the Docker socket `/var/run/docker.sock:/var/run/docker.sock` used by BUG to control Docker on the host system itself.

## Install Docker

1. Download and install docker desktop for windows, see the [official docker guide](https://docs.docker.com/desktop/windows/install/)

## Install Docker

Windows is not a file based OS like linux. As such in order for BUG to control Docker on your underlying host you'll need to use a TCP socket connection instead. To setup Docker Desktop on Windows 10 or 11 to accomplish this follow these steps;

1. In case of Docker Desktop, expose the 2375 port through the Docker Desktop GUI checkbox.
1. Start command prompt `cmd.exe` as an administrator and run the following command -
   `netsh interface portproxy add v4tov4 listenport=2375 listenaddress=0.0.0.0 connectaddress=127.0.0.1 connectport=2375`
1. Restart Docker Desktop.

## Create Files

1. Create a file called `docker-compose.yml`. You can create this file anywhere on your system but it's probably simplest to put it in a new folder all of it's own.

2. Copy the below code snippet into the file

Note - This file describes where to get the docker containers needed to run BUG from and how to create them plumbing the right bits and pieces from your system into dockers such as ports and files.

Note - You may find a text editor such as [Notepad++](https://notepad-plus-plus.org/downloads/) makes the process of creating these configuration files easier.

```
# BUG for Windows

version: "3.8"

networks:
    bug:
        name: bug
        driver: bridge

services:
    app:
        container_name: bug
        image: ghcr.io/bbc/bug:latest
        restart: always
        volumes:
          - ./logs:/home/node/bug/logs
          - ./config/panels:/home/node/bug/config/panels
          - ./config/global:/home/node/bug/config/global
        hostname: bug
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "1"
        environment:
            MODULE_PORT: 3200
            MODULE_HOME: /home/node/module
            DOCKER_NETWORK_NAME: bug
            DOCKER_HOST: "127.0.0.1"
            DOCKER_PORT: 2375
            BUG_CONTAINER: bug
            BUG_PORT: 80
            BUG_HOST: http://localhost
            BUG_LOG_FOLDER: logs
            BUG_LOG_NAME: bug
            BUG_REGISTRY_FQDN: ghcr.io/bbc
            PORT: 3000
            NODE_ENV: production
            SESSION_SECRET: aSecretForYourSessions
            WATCHTOWER_HTTP_API_TOKEN: bugupdatetoken
            WATCHTOWER_CONTAINER: bug-watchtower
        labels:
            - "com.centurylinklabs.watchtower.enable=true"
    watchtower:
        container_name: bug-watchtower
        image: containrrr/watchtower
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
        networks:
            - bug
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "1"
        environment:
            WATCHTOWER_HTTP_API_UPDATE: "true"
            WATCHTOWER_HTTP_API_TOKEN: bugupdatetoken
            WATCHTOWER_CLEANUP: "true"
            WATCHTOWER_LABEL_ENABLE: "true"
        networks:
            - bug
        ports:
            - 80:80
    mongo:
        image: mongo:latest
        restart: unless-stopped
        container_name: bug-mongo
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "1"
        networks:
            - bug
```

Note - The environment variables in this file are something you might want to adjust when setting up docker initially - here we've provided some sensible defaults to get you going. Not providing environment variables will mean they run with a sensible default

## Start BUG

1. Finally, we can now start BUG from the terminal by running `docker compose up -d` from the directory containing the `docker-compose.yml` file.

Note - This command hands over the contents of the `docker-compose.yml` file to Docker Desktop which launches the containers as described in the file. You'll need to run this command from the directory containing the `docker-compose.yml`,

2. BUG should now be available on [http://localhost](http://localhost)

3. You can double check BUG is running by typing `docker ps` into your terminal. Hopefully you'll see something that looks like this;

![docker ps](/bug/assets/images/screenshots/docker-ps.png)

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
