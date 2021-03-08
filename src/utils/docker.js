const Docker = require('dockerode');
const logger = require('@utils/logger');

var docker = new Docker({socketPath: '/var/run/docker.sock'});

module.exports = docker;
