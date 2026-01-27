---
title: Troubleshooting
parent: Installation
nav_order: 7
layout: page
---

# Troubleshooting BUG

If BUG is not behaving as expected, this page outlines common issues and how to resolve them.

---

## I can't see BUG in my web browser

- Check which port the BUG container is using. Run:

```
docker ps
```

- Look for the `PORTS` column for the `bug` container. Make sure you are browsing to `http://localhost:<port>` or the corresponding IP if running on another machine.
- Ensure no firewall or network rules are blocking access to the port.
- Verify the container is actually running (`docker ps`) and not stopped or restarting.

---

## BUG isn't starting after a fresh install

- Ensure Docker and Docker Compose are installed correctly and can run containers independently.
- Sometimes old or conflicting containers or images can prevent a fresh install from working. Use with caution:

```
docker kill $(docker ps -q)          # Stop all running containers
docker rm $(docker ps -a -q)         # Remove all containers
docker rmi $(docker images -q)       # Remove all images
```

> Warning: These commands remove all Docker containers and images on your system, not just BUG. Only run them if you understand the implications.

- After cleanup, navigate to the folder containing `docker-compose.yml` and run:

```
docker compose up -d
```

---

## BUG shows errors in the logs

- Check container logs:

```
docker logs bug
```

- Look for error messages or stack traces. Common issues include:
    - Port conflicts
    - Missing environment variables
    - MongoDB not running or accessible
- Restart the container after fixing configuration issues:

```
docker restart bug
```

---

## My panel doesn't appear in the UI

- Check that the panel container is running:

```
docker ps
```

- Ensure the panel has been added and enabled in BUG. Panels are only visible when enabled.
- Check logs for the panel container for errors:

```
docker logs <panel_container_name>
```

- Make sure the module image has been built. Use `/panel/[panelid]/config` to rebuild if needed.

---

## Data isn't updating

- Verify the worker responsible for fetching data is running.
- Check worker logs inside the module container:

```
docker exec -it <panel_container_name> sh
// then view logs in /home/node/bug/logs or console output
```

- Ensure the worker is not crashing repeatedly; workers should restart automatically.
- Confirm the module configuration is correct, especially connection settings to external devices or APIs.

---

## MongoDB issues

- Check that the Mongo container is running:

```
docker ps
```

- If necessary, view the logs:

```
docker logs bug-mongo
```

- Make sure the `config/panels` and `config/global` volumes exist and are writable, as BUG writes persistent data there.

---

## General Advice

- Always start with `docker ps` to see what containers are running.
- Use `docker logs <container_name>` to inspect any errors.
- When making configuration changes, restart the affected container.
- Avoid accessing or modifying MongoDB manually unless necessary; use BUG's APIs to prevent corruption.
- If all else fails, stop all containers, remove old containers/images for BUG, and start fresh as described above.
