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

    const panelListNamespace = io.of("/panelList");
    const panelConfigNamespace = io.of("/panelConfig");
    const panelNamespace = io.of("/panel");
    const alertNamespace = io.of("/alert");
    const bugNamespace = io.of("/bug");

    panelListNamespace.on("connection", (socket) => {
        panelListHandler(panelListNamespace, socket);
    });

    panelConfigNamespace.on("connection", (socket) => {
        panelConfigHandler(panelConfigNamespace, socket);
    });

    panelNamespace.on("connection", (socket) => {
        panelHandler(panelNamespace, socket);
    });

    alertNamespace.on("connection", (socket) => {
        alertHandler(alertNamespace, socket);
    });

    bugNamespace.on("connection", (socket) => {
        bugHandler(bugNamespace, socket);
    });

    return io;
};

module.exports = bugSocket;
