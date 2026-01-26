---
title: MacOS
parent: Installation
nav_order: 3
---

# MacOS Installation

This guide explains how to install and run BUG on MacOS using Docker Desktop and Docker Compose v2.

---

## Install Docker Desktop

1. Download and install Docker Desktop for Mac. Follow the official guide:  
   https://docs.docker.com/desktop/mac/install/

2. Choose the correct version for your architecture (Intel vs Apple Silicon M1/M2).

After installation, verify Docker is working:

```
docker --version
```

---

## Create the Docker Compose File

1. Create a dedicated folder for your BUG installation.

2. Inside this folder, create a file named `docker-compose.yml`.

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

> Note: You may wish to adjust environment variables for your setup. `SESSION_SECRET` should always be changed to a strong, unique value in production.

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

You should see containers for the BUG app and MongoDB.

---

## BUG Folder Structure

All configuration is are stored outside the containers using Docker volumes. After setup, your folder should look like this:

```

.
├── docker-compose.yml       # Docker Compose file
└── config
    ├── panels               # Individual panel configurations
    └── global               # Global configuration
```

This structure makes it easy to back up, migrate, or inspect configuration without entering the containers.

---

## Security Notes

- Change `SESSION_SECRET` to a strong, unique value before running in production.
- Do not expose BUG directly to the internet without protection.
- If public access is required, place BUG behind a reverse proxy and enable TLS.
- Restrict access to the Docker socket where possible.
- Limit network exposure of MongoDB to the Docker network only.
