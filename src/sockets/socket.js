const { Server } = require("socket.io");
const logger = require('@utils/logger');

const options = {
    cors: {
        origin: '*',
    }
};

const bugSockets = (server) => {

    const io = new Server(server,options);

    io.on('connection', socket => {
        logger.info(`Client connected with id ${socket.id}`);
    });

    return io;
};

module.exports = bugSockets;