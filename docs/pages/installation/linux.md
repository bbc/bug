---
title: Linux
parent: Installation
nav_order: 1
layout: page
---

# Linux Installation

This guide explains how to install and run BUG on a Linux system using Docker. These steps are suitable for both local deployments and virtualised environments.

---

## Install Docker

1. Install the Docker Engine for your Linux distribution.  
   For Ubuntu systems, follow the official instructions here:  
   https://docs.docker.com/engine/install/ubuntu/

2. Complete the post-installation steps so Docker can be run without root privileges:  
   https://docs.docker.com/engine/install/linux-postinstall/

Verify the installation:

```
docker --version
```

---

## Install Docker Compose (v2)

Docker Compose v2 is distributed as a Docker CLI plugin.

1. Install the Compose plugin using your package manager or by following the official guide:  
   https://docs.docker.com/compose/install/linux/

2. Verify the installation:

```
docker compose version
```

A valid version number should be displayed.

---

## Create the Docker Compose File

1. Create a directory to hold your BUG installation. A common location is `/opt/bug`.

2. Inside this directory, create a file named `docker-compose.yml`.

3. Copy the following contents into the file:

```
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
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config/panels:/home/node/bug/config/panels
      - ./config/global:/home/node/bug/config/global
    environment:
      MODULE_PORT: 3200
      MODULE_HOME: /home/node/module
      DOCKER_NETWORK_NAME: bug
      BUG_CONTAINER: bug
      BUG_PORT: 80
      BUG_HOST: 127.0.0.1
      PORT: 3000
      NODE_ENV: production
      SESSION_SECRET: change-me
    networks:
      - bug
    ports:
      - 80:80
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "1"

  mongo:
    image: mongo:latest
    container_name: bug-mongo
    restart: unless-stopped
    networks:
      - bug
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "1"
```

The values provided here are sensible defaults. You should review and adjust them to suit your environment.

---

## Start BUG

1. From the directory containing `docker-compose.yml`, start BUG:

```
docker compose up -d
```

2. BUG should now be available at:

http://localhost

3. Confirm that the containers are running:

```
docker ps
```

You should see containers for the BUG application and MongoDB.

---

## BUG Folder Structure

All configuration is stored outside the containers and mounted using volumes. After startup, your directory structure should look like this:

```
.
├── docker-compose.yml
└── config
    ├── panels
    └── global
```

This layout allows configuration to be backed up or migrated without accessing the containers.

---

## Security Notes

- Change `SESSION_SECRET` to a strong, unique value before running BUG in production.
- Do not expose BUG directly to the internet without additional protection.
- If BUG must be publicly accessible, place it behind a reverse proxy and enable TLS.
- Restrict access to the Docker socket where possible, as it grants elevated control over the host.
- Limit network access to MongoDB so it is not exposed outside the Docker network.
