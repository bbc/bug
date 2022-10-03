---
layout: page
title: Development
nav_order: 2
has_children: true
---

# Development

All the information you need to get started developing BUG modules can be found here.

First off you'll need to get a development instance up and running. Both production and development versions of BUG run in a docker container.

The development version has live mount and runs `nodemon` and `create-react-app` meaning the app reloads on each file save for both the frontend and backend. You develop on your development machine's filesystem and the files are mounted into the running bug container.

Running BUG for production? You probably want [these instructions](/pages/installation.html) instead.

## Installation

For development on your local machine with docker (recommended)

1. To begin you'll need to install the [Docker Desktop](https://www.docker.com/products/docker-desktop/) and the latest LTS version of [Node.js](https://nodejs.dev/download/) on your development machine. The BUG codebases is currently tested against `v16.17.x`.
1. Check your Docker and Node.js installations are working using the commands `docker -v` and `node -v`. You should see some sensible version numbers.
1. Next, clone the BUG repository using `git clone https://github.com/bbc/bbcnews-bug`
1. Change directory to the `./src` folder of the repository
1. Run `npm i`. To install all the backend dependencies locally
1. Change directory to the `./src/client` folder of the repository
1. Run `npm i`. To install all the frontend dependencies locally
1. Change directory to the root folder of the repository
1. Spin up your development instance with `docker-compose up -d`. It may take around 5 minutes for the development build of the frontend react app to become available. You can view the live logs from the main BUG contrainer `bug` using the command `docker logs --tail 1000 -f bug`.
1. Get developing. If you're using the default ports, the web interface will be available on port 3000, the API on port 3101 and the GUI view of the MongoDB database on port 3202.

You can change many of the port parameters, logging locations by setting environment variables in the `docker-compose.yml` file in the root directory.

When developing in docker changes will automatically be reflected in docker using volume mounts and nodemon to reload. Please make sure to `npm install` on your local machine before spinning up the compose project.

Microsoft's [Visual Studio Code](https://code.visualstudio.com/) has been used for most of BUG's development. Other IDE's are available. However, Visual Studio Code paired with the official Docker extension found in the extension's store is really useful for outputting logs and visualising the orchestration.
