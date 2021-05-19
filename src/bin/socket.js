const { Server } = require("socket.io");
const logger = require("@utils/logger")(module);

const panelListHandler = require("@sockets/panel-list");
const panelConfigHandler = require("@sockets/panel-config");
const panelHandler = require("@sockets/panel");
const alertHandler = require("@sockets/alert");
const bugHandler = require("@sockets/bug");

const options = {
    cors: {
        origin: "*",
    },
};

const bugSocket = (server) => {
    const io = new Server(server, options);

    io.on("connection", (socket) => {
        logger.info(`socket connection ${socket.id}`);
        panelListHandler(io, socket);
        panelConfigHandler(io, socket);
        panelHandler(io, socket);
        alertHandler(io, socket);
        bugHandler(io, socket);
    });

    return io;
};

module.exports = bugSocket;
