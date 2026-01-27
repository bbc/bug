---
title: Windows
parent: Installation
nav_order: 4
layout: page
---

# Windows Installation

Docker for Windows does not support passing through the Docker socket (`/var/run/docker.sock`) used by BUG on Linux or MacOS.  
Instead, BUG connects to Docker via a TCP socket.

---

## Install Docker Desktop

1. Download and install Docker Desktop for Windows from the official guide:  
   https://docs.docker.com/desktop/windows/install/

2. Choose the correct version for your architecture (Intel or ARM).

---

## Configure Docker TCP Socket

1. In Docker Desktop, enable the option to expose the daemon on TCP port 2375 (without TLS).

2. Open a command prompt as administrator and run:

```
netsh interface portproxy add v4tov4 listenport=2375 listenaddress=0.0.0.0 connectaddress=127.0.0.1 connectport=2375
```

3. Restart Docker Desktop.

---

## Create the Docker Compose File

1. Create a dedicated folder for BUG.

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
    volumes:
      - ./config/panels:/home/node/bug/config/panels
      - ./config/global:/home/node/bug/config/global
    hostname: bug
    environment:
      MODULE_PORT: 3200
      MODULE_HOME: /home/node/module
      DOCKER_NETWORK_NAME: bug
      DOCKER_HOST: "127.0.0.1"
      DOCKER_PORT: 2375
      BUG_CONTAINER: bug
      BUG_PORT: 80
      BUG_HOST: http://localhost
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

> Note: Adjust environment variables to suit your setup. Always change `SESSION_SECRET` in production.

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

You should see containers for BUG and MongoDB.

---

## BUG Folder Structure

All configuration is stored outside the containers using Docker volumes:

```
.
├── docker-compose.yml       # Docker Compose file
└── config
    ├── panels               # Each panel's configuration
    └── global               # Global configuration
```

This makes it easy to back up, migrate, or inspect configuration without entering the containers.

---

## Security Notes

- Exposing the Docker TCP socket is a security risk. Only do this on a trusted network.
- Change `SESSION_SECRET` to a strong, unique value.
- Do not expose BUG directly to the internet without a reverse proxy and TLS.
