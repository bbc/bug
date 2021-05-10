const logger = require('@utils/logger')(module);

const alertHandler = (io, socket) => {

    socket.on('alert', (data) => {
        socket.broadcast.emit('alert', data);
        logger.action(data.message);
    });

}

module.exports = alertHandler;