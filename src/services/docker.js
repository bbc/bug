const Docker = require('dockerode');
const logger = require('@services/logger');

var docker = new Docker({socketPath: '/var/run/docker.sock'});

module.exports = docker;
