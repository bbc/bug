const logger = require("@utils/logger")(module);

const alertHandler = (namespace, socket) => {
    socket.on("event", (data) => {
        let level;
        switch (data.options.variant) {
            case "info":
            case "success":
                level = "info";
                break;
            case "warning":
                level = "warn";
                break;
            case "error":
                level = "error";
                break;
            default:
                level = "info";
        }

        if (data.options.broadcast) {
            delete data.options.broadcast;
            socket.broadcast.emit("event", data);
        }

        logger[level](data.message, { userId: data?.userId, panelId: data?.panelId });
    });
};

module.exports = alertHandler;
