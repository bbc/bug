const { Server } = require("socket.io");
const logger = require('@utils/logger')(module);

const panelHandler = require('@sockets/panel');
const alertHandler = require('@sockets/alert');
const bugHandler = require('@sockets/bug');

const options = {
    cors: {
        origin: '*',
    }
};

const bugSocket = (server) => {

    const io = new Server(server, options);

    const onConnection = (socket) => {
        logger.info(`socket connection ${socket.id}`)
        panelHandler(io, socket);
        alertHandler(io, socket);
        bugHandler(io, socket);
    }

    io.on('connection', onConnection);

    return io;
};

module.exports = bugSocket;