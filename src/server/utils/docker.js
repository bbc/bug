"use strict";

//TODO error handling with throw

const Docker = require("dockerode");
const socketPath = process.env.DOCKER_SOCKET_PATH || "/var/run/docker.sock";
const dockerHost = process.env.DOCKER_HOST;
const dockerPort = process.env.DOCKER_PORT || 2375;

let config = {};

if (dockerHost && dockerPort) {
    config = { host: dockerHost, port: dockerPort }; //defaults to http
} else {
    config = { socketPath: socketPath };
}

let docker = new Docker(config);

module.exports = docker;
