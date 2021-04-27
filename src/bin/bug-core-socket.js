const { Server } = require("socket.io");
const logger = require('@utils/logger');

const panelHandler = require('@sockets/panel');
// const snackbarHandler = require('@sockets/snackbar');
const bugHandler = require('@sockets/bug');

const options = {
    cors: {
        origin: '*',
    }
};

const bugSocket = (server) => {
    
    const io = new Server(server,options);

    const onConnection = (socket) => {
        logger.info(`Connection ${socket.id}`)
        panelHandler(io, socket);
        // snackbarHandler(io, socket);
        bugHandler(io, socket);
    }

    io.on('connection',onConnection);

    return io;
};

module.exports = bugSocket;