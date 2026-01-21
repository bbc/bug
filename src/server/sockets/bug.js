const bugQuote = require("@services/bug-quote");

const bugHandler = (namespace, socket) => {
    // Prevent stacking the 'quote' listener
    socket.removeAllListeners("quote");

    socket.on("quote", async (data) => {
        try {
            const quote = await bugQuote();
            socket.emit("quote", quote);
        } catch (err) {
            console.error("Failed to fetch bug quote", err);
        }
    });
};

module.exports = bugHandler;