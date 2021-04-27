#!/usr/bin/env node

const bugApi = require('./bug-core-api');
const scoket = require('@sockets/socket');
const http = require('http');
const socket = require('../sockets/socket');

const port = process.env.PORT_DEV_API || '3101';
bugApi.set('port', port);

const server = http.createServer(bugApi);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//Give the server to sockets as well
socket(server);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`Listening on ${bind}`);
}