---
layout: page
title: Docker
parent: Development
nav_order: 10
---

# Docker and BUG

BUG's main application runs in a docker container, it speaks to a separate database in a separate container.
When you start a panel the main BUG application will build a docker container and launch it on your system and then speak to it via an API.
This enables BUG to perform very different monitoring and control tasks without continually adjusting the core BUG code.

Below we've gathered a few helpful terminal commands that'll help you work with the docker cli and debug inside a panel's container.

## Checking BUG status

Verify your containers are running using the `docker ps` command.

## Check individual container outputs

To look at the logs (terminal) of the core container use;

`docker logs bbcnews-bug_app`

Where `bbcnews-bug_app` is the name of the container that can be seen from `docker ps`. You could also add a panel id here to view a panel's terminal output

## Stop BUG

To stop the bug, all it's services and containers use;

`docker compose down --remove-orphans`

## Detaching from the Terminal

Using the flag `-d` with docker-compose detaches the container output stream from the terminal
