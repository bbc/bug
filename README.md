[![Backend](https://github.com/bbc/bbcnews-bug/actions/workflows/backend.yml/badge.svg)](https://github.com/bbc/bbcnews-bug/actions/workflows/backend.yml) [![Frontend](https://github.com/bbc/bbcnews-bug/actions/workflows/frontend.yml/badge.svg)](https://github.com/bbc/bbcnews-bug/actions/workflows/frontend.yml) [![Deploy](https://github.com/bbc/bbcnews-bug/actions/workflows/docker.yml/badge.svg)](https://github.com/bbc/bbcnews-bug/actions/workflows/docker.yml)

# BUG (Broadcast Universal Gateway)

![BUG Logo](https://github.com/bbc/bbcnews-bug/blob/main/src/client/public/icons/bug-logo-256x256.png?raw=true)

BUG provides management and control of network devices in broadcast environments.

This is the all new version 3.

## Development: Docker

For development on your local machine with docker (recommended)

-   Install the latest version of `docker`, `docker-compose`, `node.js` and `npm`.
-   Clone this repository
-   Change directories to the `./src` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src/client` folder of the repository
-   Run `npm install`.
-   Spin up your development instance with `docker compose up -d`

You can change many of the port parameters, logging locations by setting environment variables in a `.env` file in the root directory.

When developing in docker changes will automatically be relfected in docker using volume mounts and nodemon to reload. Please make sure to `npm install` on your local machine before spinning up the compose project.

## Development: Local Machine

-   Clone the repository
-   Change directories to the `./src` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src/client` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src` folder of the repository
-   Use `npm run development` to run on your local machine.

Note that this method still requires you to have docker on your machine to test functionality like adding and removing panels. You'll also need a locally running MongoDB aswell.

## Upgrading BUG

Currently BUG can only be upgraded from the command line

The first stage is to get the latest version of the BUG image from the registry using this command

`docker pull 172.26.108.110:5000/bug:latest`

Next, run the following command and Docker will determine which containers to restart with minimal downtime of approximately 10 seconds.

`docker-compose up -d`

That's it - your BUG instance is up to date.

## Helpful Docker Tips

### Detaching from the Terminal

Using the flag `-d` with docker-compose detaches the container output stream from the terminal

### Checking BUG status

Verify your containers are running using the `docker ps` command.

### Check individual container outputs

To look at the logs (terminal) of the core container use;

`docker logs bbcnews-bug_bug_1`

Where `bbcnews-bug_bug_1` is the name of the container that can be seen from `docker ps`.

### Stop BUG

To stop the bug, all it's services and containers use;

`docker compose down --remove-orphans`
