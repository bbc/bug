---
layout: page
title: Environment Variables
parent: Installation
nav_order: 8
has_children: false
---

# Environment Variables

You can set a range of environment variables on the main BUG container to control it's behaviour. These are documented below.

| Variable                  | Default                | Type    | Description                                                                                                         |
| ------------------------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| MODULE_PORT               | 3200                   | INTEGER | Port used to communicate in the BUG network between the main BUG app and panel containers                           |
| MODULE_HOME               | /home/node/module      | STRING  | When modules are built this path determines where source code is added to the container                             |
| WATCHTOWER_HTTP_API_TOKEN | bugupdatetoken         | STRING  | HTTP access token set on both the watchtower container and bug container for update messages                        |
| WATCHTOWER_CONTAINER      | bug-watchtower         | STRING  | The hostname of the the watchtower container associated with BUG. Used for sending update messages                  |
| DOCKER_NETWORK_NAME       | bug                    | STRING  |                                                                                                                     |
| DOCKER_SOCKET_PATH        | /var/run/docker.sock   | STRING  | BUG container Docker socket path required to control the Docker on the underlying host. Only needs set for Windows. |
| BUG_CONTAINER             | bug                    | STRING  |                                                                                                                     |
| BUG_PORT                  | 80                     | INTEGER | The port BUG is available on                                                                                        |
| BUG_HOST                  | 127.0.0.1              | STRING  | BUG host name. Used in documentation endpoints and on the BUG info page.                                            |
| BUG_LOG_FOLDER            | logs                   | STRING  |                                                                                                                     |
| BUG_LOG_NAME              | bug                    | STRING  |                                                                                                                     |
| BUG_REGISTRY_FQDN         | ghcr.io/bbc            | STRING  | Where to get new BUG containers from - if not set uses DockerHub.                                                   |
| PORT                      | 3000                   | INTEGER | Create-React-App port for development purposes only                                                                 |
| NODE_ENV                  | development            | STRING  |                                                                                                                     |
| SESSION_SECRET:           | aSecretForYourSessions | STRING  | CHANGE THIS - Passport.js global session secrets. Keeps your users safe                                             |
