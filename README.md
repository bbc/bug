[![Backend](https://github.com/bbc/bbcnews-bug/actions/workflows/backend.yml/badge.svg)](https://github.com/bbc/bbcnews-bug/actions/workflows/backend.yml) [![Frontend](https://github.com/bbc/bbcnews-bug/actions/workflows/frontend.yml/badge.svg)](https://github.com/bbc/bbcnews-bug/actions/workflows/frontend.yml) [![Deploy](https://github.com/bbc/bbcnews-bug/actions/workflows/docker.yml/badge.svg)](https://github.com/bbc/bbcnews-bug/actions/workflows/docker.yml)

# BUG (Broadcast Universal Gateway)

![BUG Logo](https://github.com/bbc/bbcnews-bug/blob/main/src/client/public/icons/bug-logo-256x256.png?raw=true)

BUG provides management and control of network devices in broadcast environments.

This is the all new version 3.

All the detailed information you'll need to get started is [bug.bbc.github.io](https://laughing-journey-961a0bed.pages.github.io/).

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
