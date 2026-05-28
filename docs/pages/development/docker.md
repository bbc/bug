---
title: Docker
parent: Development
nav_order: 10
layout: page
---

# Docker and BUG

BUG runs as a containerised system:

- `bug` (core app service): API + frontend and orchestration of module containers.
- `bug-mongo` (database service): MongoDB data store.
- panel/module containers: built and run on demand by the core app.

In development, `docker-compose.yml` mounts the repository into the `bug` container and mounts `/var/run/docker.sock`. This allows the core app to build and control module containers directly via the host Docker daemon.

This architecture keeps the core platform stable while allowing modules to be built, upgraded, restarted, and debugged independently.

---

## Runtime Topology

The default compose network is `bug` (bridge). Core and module containers communicate over this shared network.

Important development defaults from `docker-compose.yml`:

- Core container name: `bug`
- Database container name: `bug-mongo`
- Core app ports: `3000` (UI), `3101` (API)
- MongoDB port: `27017`
- Module base port (internal orchestration): `3200`
- `NODE_ENV=development`

The dev image runs `npm run dev`, so file changes in the mounted repo are reflected through nodemon/vite behavior.

---

## Quick Health Checks

Check running services:

```bash
docker ps
```

Check core logs:

```bash
docker logs --tail 200 -f bug
```

Check Mongo logs:

```bash
docker logs --tail 200 -f bug-mongo
```

Inspect service state and restart loops:

```bash
docker inspect --format='{{.Name}} {{.State.Status}} {{.RestartCount}}' bug bug-mongo
```

---

## Module Container Debugging

Each enabled panel typically has a dedicated module container, normally identifiable by panel ID.

List likely module containers:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
```

View module logs:

```bash
docker logs yourlongpanelid
```

Follow module logs in real time:

```bash
docker logs --tail 200 -f yourlongpanelid
```

Check if the module container is on the expected network:

```bash
docker inspect --format='{{json .NetworkSettings.Networks}}' yourlongpanelid
```

If a module repeatedly crashes, check:

- container logs for startup/config errors,
- module config values in the panel settings,
- whether dependent services/endpoints are reachable from the module network.

---

## Compose Lifecycle Commands

Run these from the folder containing `docker-compose.yml`.

Start core services in background:

```bash
docker compose up -d
```

Stop and remove compose services:

```bash
docker compose down --remove-orphans
```

Restart only the core app:

```bash
docker compose restart app
```

Rebuild and restart core app image after Dockerfile/dependency changes:

```bash
docker compose up -d --build app
```

Show compose service status:

```bash
docker compose ps
```

---

## Common Cleanup and Recovery

Remove stopped containers:

```bash
docker container prune
```

Remove dangling images:

```bash
docker image prune
```

If builds fail with transient builder/snapshot errors:

```bash
docker builder prune -af
```

Use destructive cleanup commands with care on shared development hosts.

---

## Troubleshooting Notes

- If `bug` cannot spawn module containers, check Docker socket mount and daemon availability.
- If UI is unreachable, verify port bindings (`3000:3000`, `3101:3101`) and any local firewall/VPN conflicts.
- If module containers start but cannot talk to core services, inspect network attachment and environment assumptions.
- If compose starts but code changes are not reflected, confirm you are using the dev compose file and volume mounts are active.
- If module test containers fail unpredictably, rebuild and prune stale builder cache before retesting.

---

## Production vs Development Reminder

This page describes development-oriented Docker usage.

Production deployments should follow the installation guidance and environment-specific hardening (secrets, port exposure, persistence, and restart policies).
