const { Server } = require("socket.io");
const logger = require("@utils/logger")(module);

const panelListHandler = require("@sockets/panel-list");
const panelConfigHandler = require("@sockets/panel-config");
const panelHandler = require("@sockets/panel");
const alertHandler = require("@sockets/alert");
const bugHandler = require("@sockets/bug");
const strategiesHandler = require("@sockets/strategies");
const userHandler = require("@sockets/user");

const passport = require("passport");
const session = require("@utils/session");

const options = {
    cors: {
        origin: "*",
    },
};

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

const bugSocket = (server) => {
    const io = new Server(server, options);

    io.use(wrap(session()));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    io.use((socket, next) => {
        if (socket.request.user) {
            console.log(socket.request.user);
            next();
        } else {
            next(new Error("Unauthorized"));
        }
    });

    const panelListNamespace = io.of("/panelList");
    const panelConfigNamespace = io.of("/panelConfig");
    const panelNamespace = io.of("/panel");
    const alertNamespace = io.of("/alert");
    const bugNamespace = io.of("/bug");
    const strategiesNamespace = io.of("/strategies");
    const userNamespace = io.of("/user");

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

    strategiesNamespace.on("connection", (socket) => {
        strategiesHandler(strategiesNamespace, socket);
    });

    userNamespace.on("connection", (socket) => {
        userHandler(userNamespace, socket);
    });

    return io;
};

module.exports = bugSocket;
