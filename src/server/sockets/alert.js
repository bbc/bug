const logger = require("@utils/logger")(module);

const alertHandler = (namespace, socket) => {
    // remove previous "event" listeners to prevent stacking/memory leaks
    socket.removeAllListeners("event");

    socket.on("event", (data) => {
        let level;
        // logic remains the same...
        switch (data.options.variant) {
            case "info":
            case "success":
                level = "info";
                break;
            case "warning":
                level = "warning";
                break;
            case "error":
                level = "error";
                break;
            default:
                level = "info";
        }

        if (data.options.broadcast) {
            const broadcastData = { ...data };
            delete broadcastData.options.broadcast;
            socket.broadcast.emit("event", broadcastData);
        }

        logger[level](`sockets/alert (from UI): ${data.message}`, { userId: data?.userId, panelId: data?.panelId });
    });
};

module.exports = alertHandler;