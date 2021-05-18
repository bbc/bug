const bugQuote = require('@services/bug-quote');

const bugHandler = (io, socket) => {
    socket.on('quote', async (data) => {
        const quote = await bugQuote();
        socket.emit('quote',quote);
    });
}

module.exports = bugHandler;