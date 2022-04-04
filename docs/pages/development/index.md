---
layout: page
title: Development
nav_order: 2
has_children: true
---

# Development

Information about developing modules for BUG is found here.

First off you'll need to get a development instance up and running. Both production and development versions of BUG run in a docker container.

The development version has live mounts, runs `nodemon` and `create-react-app` meaning the app reloads on each file save for both the frontend and backend. You develop on your development machine's filesystem and the files are mounted into the running bug container.

To begins you'll need to install the [Docker Desktop](https://www.docker.com/products/docker-desktop/)
and the latest LTS verion od [Node.js](https://nodejs.dev/download/) on your development machine.

## Development Installation: Docker

For development on your local machine with docker (recommended)

1. Install the latest version of `Docker Desktop`, `node.js` and `npm`.
2. Clone the BUG repository using `git clone https://github.com/bbc/bbcnews-bug`
3. Change directories to the `./src` folder of the repository
4. Run `npm install`.
5. Change directories to the `./src/client` folder of the repository
6. Run `npm install`.
7. Spin up your development instance with `docker compose up -d`
8. Get developing. If you're using the default ports, the web interface will be avalible on port 3000, the API on port 3101 and ta GUI view of the MongoDB database on port 3202.

You can change many of the port parameters, logging locations by setting environment variables in the `docker-compose.yml` file in the root directory.

When developing in docker changes will automatically be relfected in docker using volume mounts and nodemon to reload. Please make sure to `npm install` on your local machine before spinning up the compose project.

## Development Installation: Local Machine

-   Clone the repository
-   Change directories to the `./src` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src/client` folder of the repository
-   Run `npm install`.
-   Change directories to the `./src` folder of the repository
-   Use `npm run development` to run on your local machine.

Note that this method still requires you to have docker on your machine to test functionality like adding and removing panels. You'll also need a locally running MongoDB aswell.
