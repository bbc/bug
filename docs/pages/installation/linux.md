---
layout: page
title: Linux
parent: Installation
nav_order: 1
---

# Linux

## Install Docker

1. Download and install the docker engine for your flavour of linux. We quite like Ubuntu [Docker Install Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

2. Follow these post-installation steps so that you don't need to run docker as root [Docker Post-Installaiton Steps](https://docs.docker.com/engine/install/linux-postinstall/)

## Install Docker-Compose

On Linux platforms docker engine is packaged separately to other docker tools. Docker Compose is used to spin up the main BUG app and additional services together in a single command.

1. Run this command to download the current stable release of Docker Compose:

```
 sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2. Apply executable permissions to the binary

```
 sudo chmod +x /usr/local/bin/docker-compose
```

3. Check it works. A sensible version number should be returned

```
docker-compose --version
```

## Create Files

1. Create a file called `docker-compose.yml`. You can create this file anywhere on your filesystem but it's probably best to put it in a well-known location - something like `/opt/bug`.

2. Copy the below code snippet into the file:

```
# BUG for Linux

version: "3.8"

networks:
    bug:
        name: bug
        driver: bridge

services:
    app:
        container_name: bug
        image: ghcr.io/bbc/bug:latest
        extra_hosts:
          - "host.docker.internal:host-gateway"
        restart: always
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock
          - ./logs:/home/node/bug/logs
          - ./config/panels:/home/node/bug/config/panels
          - ./config/global:/home/node/bug/config/global
        environment:
            MODULE_PORT: 3200
            MODULE_HOME: /home/node/module
            DOCKER_NETWORK_NAME: bug
            BUG_CONTAINER: bug
            BUG_PORT: 80
            BUG_HOST: 127.0.0.1
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
        networks:
            - bug
        ports:
            - 80:80
    watchtower:
        container_name: bug-watchtower
        image: containrrr/watchtower
        restart: always
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
        networks:
            - bug
        environment:
            WATCHTOWER_HTTP_API_UPDATE: "true"
            WATCHTOWER_HTTP_API_TOKEN: bugupdatetoken
            WATCHTOWER_CLEANUP: "true"
            WATCHTOWER_LABEL_ENABLE: "true"
    mongo:
        image: mongo:latest
        restart: unless-stopped
        container_name: bug-mongo
        networks:
            - bug
```

Note - The environment variables in this file are something you might want to adjust when setting up docker initially - here we've provided some sensible defaults to get you going.

## Start BUG

1. Finally, we can now start BUG from the terminal by running `docker-compose up -d` from the directory containing the `docker-compose.yml` file.

2. BUG should now be available on [http://localhost](http://localhost)

3. You can double check BUG is running by typing `docker ps` into your terminal. Hopefully you'll see something that looks like this;

![docker ps](/bug/assets/images/screenshots/docker-ps.png)

## BUG Folder Structure

All config and logs for BUG are stored outside of the docker container in a subfolder of the folder containing your docker-compose.yml file:
Your BUG folder structure should look like this:

```
.
├── `docker-compose.yml`.       # Docker Compose file created in step 2
├── config                      # A folder to hold all the BUG configuration
│   ├── panels                  # Each inviduals panel's configuration can be viewed here
│   └── global                  # Global configuration can be viewed here
└── logs                        # You can find all the logs here
```
