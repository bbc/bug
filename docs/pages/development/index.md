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

## Installation

For development on your local machine with docker (recommended)

1. To begin you'll need to install the [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   and the latest LTS version od [Node.js](https://nodejs.dev/download/) on your development machine.
2. Clone the BUG repository using `git clone https://github.com/bbc/bbcnews-bug`
3. Change directory to the `./src` folder of the repository
4. Run `npm ci`. To install all the backend dependencies locally
5. Change directory to the `./src/client` folder of the repository
6. Run `npm ci`. To install all the frontend dependencies locally
7. Change directory to the root folder of the repository
8. Spin up your development instance with `docker-compose up -d`. It may take around 5 minutes for the development build of the frontend react app to become availible.
9. Get developing. If you're using the default ports, the web interface will be availible on port 3000, the API on port 3101 and the GUI view of the MongoDB database on port 3202.

You can change many of the port parameters, logging locations by setting environment variables in the `docker-compose.yml` file in the root directory.

When developing in docker changes will automatically be reflected in docker using volume mounts and nodemon to reload. Please make sure to `npm install` on your local machine before spinning up the compose project.

Microsoft's [Visual Studio Code](https://code.visualstudio.com/) has been used for most of BUG's development. Other IDE's are availible. However, Visual Studio Code paired with the official Docker extension found in the extension's store is really useful for outputting logs and visualising the orchestration.
