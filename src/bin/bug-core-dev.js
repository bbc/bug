#!/usr/bin/env node

const register = require('module-alias/register')
const bugApi = require('@bin/api');
const bugSocket = require('@bin/socket');
const bugWorkers = require('@bin/workers');
const http = require('http');

const port = process.env.BUG_CORE_PORT || '3101';
bugApi.set('port', port);

const server = http.createServer(bugApi);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//Give the server to sockets as well
bugSocket(server);

// and load the worker thread
bugWorkers();

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