---
layout: page
title: Raspberry Pi
parent: Installation
nav_order: 2
---

# Raspberry Pi

You can run BUG on a Raspberry Pi - we suggest using a version 4 for this. If you plan on running more than 5 or 6 panels it probably worth considering another method of hosting.

The process for installation is largely the same as the [Linux guide](/pages/installation/linux.html). However, the `docker-compose.yml` file differs slightly owing to a lack of support for MongoDB on ARM processors.

## Install Docker

1. Download and install the docker engine for your variation of linux. We quite like ubuntu [Docker Install Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

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

1. Create a file called `docker-compose.yml`
2. Copy the below code snippet into the file

Note - This describes where to get the docker containers needed to run BUG from and how to create them plumbing the right bits and pieces from your system into dockers such as ports and files.

```
# BUG for Raspberry Pi

version: "3.8"

networks:
    bug:
        name: bug
        driver: bridge

services:
    app:
        container_name: bug
        image: harbor.prod.bcn.bbc.co.uk/bug/app:latest
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
            BUG_REGISTRY_FQDN: harbor.prod.bcn.bbc.co.uk
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
        image: arm64v8/mongo
        restart: unless-stopped
        container_name: bug-mongo
        networks:
            - bug
```

Note - The environment variables in this file are something you might want to adjust when setting up docker initially - here we've provided some sensible defaults to get you going. Not providing environment variables will mean they run with a sensible default

## Start BUG

1. Finally, we can now start BUG from the terminal by running `docker-compose up -d` from the directory containing the `docker-compose.yml` file.

Note - This command hands over the contents of the `docker-compose.yml` file to Docker Desktop which launches the containers as described in the file. You'll need to run this command from the directory containing the `docker-compose.yml`

2. BUG should now be available on [http://localhost](http://localhost). Using `docker ps` can help you verify this.