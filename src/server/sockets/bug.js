const bugQuote = require("@services/bug-quote");
const logger = require("@core/logger")(module);

const bugHandler = (namespace, socket) => {
    // Prevent stacking the 'quote' listener
    socket.removeAllListeners("quote");

    socket.on("quote", async (data) => {
        try {
            const quote = await bugQuote();
            socket.emit("quote", quote);
        } catch (err) {
            logger.error("Failed to fetch bug quote", err);
        }
    });
};

module.exports = bugHandler;