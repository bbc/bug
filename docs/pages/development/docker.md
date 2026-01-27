---
title: Docker
parent: Development
nav_order: 10
layout: page
---

# Docker and BUG

BUG runs its main application in a **Docker container**, with a separate container for its database.  
When you start a panel, the core BUG application **builds and launches a dedicated container** for that panel, then communicates with it via an API.

This containerised architecture allows BUG to handle a wide variety of monitoring and control tasks **without modifying the core application code**. It also allows individual panels to be restarted independently of each other and the core services.

Below are some useful Docker commands to help you **monitor, debug, and manage BUG containers**.

---

## Checking BUG status

Use the following command to see which containers are running:

```bash
docker ps
```

Find the one named `bug` and make sure it's not in a `restarting` mode.
To look at the logs (terminal) of the core container use:

```bash
docker logs bug
```

## Check individual container outputs

All running panels will have a relevant docker container, identifiable by their panel id. This is the same as the one shown when you navigate to the panel in the Web UI.

To view the logs of a particular panel:

```bash
docker logs yourlongpanelid
```

## BUG system actions

To perform any of these actions, navigate to the installation folder containing the `docker-compose.yml` file (usually `/opt/bug`).

### Stop BUG

To stop all BUG services and containers

```
docker compose down --remove-orphans
```

### Start BUG

This will start the BUG core web service and database, but not any previously-built individual panel containers. You'll have to enable these in the BUG UI.

```
docker compose up -d
```
