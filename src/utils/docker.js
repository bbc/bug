'use strict';

//TODO error handling with throw

const Docker = require('dockerode');
const logger = require('@utils/logger');
const path = require('path');
const socketPath =  process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock'

let docker = new Docker({socketPath: socketPath});

module.exports = docker;