const alertHandler = (io, socket) => {

    socket.on('alert', (data) => {
        socket.broadcast.emit('alert', data);
    });

}

module.exports = alertHandler;