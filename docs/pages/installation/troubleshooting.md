---
layout: page
title: Troubleshooting
parent: Installation
nav_order: 7
---

Help me! My BUG won't work.

So you've installed BUG - it doesn't work and now you're here. Here are a few common issues and some solutions.

## Q: Can't see BUG in my web browser

A: Check the `port` for the `bug-app` when you type in `docker ps` to the terminal? You'll only be able to access BUG from this port.

## Q: I'm trying to run a totally fresh install of BUG

A: The following docker commands may help, although use with caution. `docker kill $(docker ps -q)`, kills all running containers on your system. `docker rm $(docker ps -a -q)` removes these containers. `docker rmi $(docker images -q)` removes all images on your host system
