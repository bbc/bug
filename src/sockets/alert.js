
const alertHandler = (io, socket) => {

    socket.on('alert', (data) => {
        console.log(data);
        socket.broadcast.emit('alert', data);
    });

}

module.exports = alertHandler;