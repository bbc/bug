---
title: Configuration
parent: Architecture
nav_order: 0
layout: page
---

# Configuration

BUG stores configuration in two places:

- environment variables (in docker-compose.yml)
- config files (both global and panel)

> Note about MongoDB:
> Configuration should never be stored in Mongo. The database should only be used for caching data from a connected device or historical stats. It should be treated as diposable. The data volumes are deliberately not mounted outside the database container, meaning they could be lost during an upgrade or rebuild.

## Environment Variables

Most of these shouldn't need to be changed, but here's a list of the current environment variables available to be set:

| NAME                | Default Value       | Description                                                              |
| ------------------- | ------------------- | ------------------------------------------------------------------------ |
| MODULE_PORT         | `3200`              | The port used by each module to run the local API                        |
| MODULE_HOME         | `/home/node/module` | Where the module's code is installed to inside the docker container      |
| DOCKER_NETWORK_NAME | `bug`               | The name of the internal docker network used to connect the services     |
| BUG_CONTAINER       | `bug`               | The name of the docker application container                             |
| BUG_PORT            | `80`                | The port hosting the main BUG user interface                             |
| BUG_HOST            | `127.0.0.1`         | The address where the main docker application is running                 |
| PORT                | `3000`              | The port running the main docker application API                         |
| NODE_ENV            | `production`        | Whether the application is running in `production` or `development` mode |
| SESSION_SECRET      | `change-me`         | The session secret used by the BUG REST API and socket server            |

## Panel Configuration

Each panel's configuration is stored in a text file hosted on the server. These files are mounted within the BUG application, making them available to be read and written to by the API.

Each panel stores its configuration by calling the BUG core API. Containers receive their configuration when started or updated.

- Each module should provide a base config page accessible at `/config`.
- The API route `/api/panel/config/${panelId}` accepts a PUT request with a config object.
- Valid fields are merged with existing configuration; invalid fields are ignored.
- Field validation is the responsibility of the module developer.

### Data Persistence

- Persistent configuration includes things like IP addresses, credentials, or default module options.
- Temporary runtime data should be stored in the database or cache.
- Anything stored in a panel container during runtime should not be considered permanent.
- Containers can be restarted, rebuilt, or removed at any time.

### Principles

- Design modules to function correctly even if runtime data is lost.
- Persistent config should always be stored in BUG Core and passed to the module container.
- Use the panel-specific Mongo database for temporary or frequently-updated data.

---

This architecture ensures that BUG remains scalable, modular, and resilient while providing clear boundaries between persistent configuration, frontend UI, and module runtime logic.
