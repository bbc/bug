const logger = require("@utils/logger")(module);

const alertHandler = (namespace, socket) => {
    socket.on("event", (data) => {
        socket.broadcast.emit("event", data);
        logger.action(data.message);
    });
};

module.exports = alertHandler;
