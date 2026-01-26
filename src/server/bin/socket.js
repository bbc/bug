const { Server } = require("socket.io");

const containerHandler = require("@sockets/container");
const panelListHandler = require("@sockets/panel-list");
const panelConfigHandler = require("@sockets/panel-config");
const panelHandler = require("@sockets/panel");
const alertHandler = require("@sockets/alert");
const bugHandler = require("@sockets/bug");
const strategiesHandler = require("@sockets/strategies");
const systemHandler = require("@sockets/system");
const userHandler = require("@sockets/user");
const passport = require("passport");
const session = require("@utils/session");

const options = {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket'],
    allowEIO3: true
};

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

const bugSocket = (server) => {
    const io = new Server(server, options);

    io.use(wrap(session()));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    io.use((socket, next) => {
        if (socket.request.user) {
            next();
        } else {
            next(new Error("Unauthorized"));
        }
    });

    const panelListNamespace = io.of("/panelList");
    const panelConfigNamespace = io.of("/panelConfig");
    const panelNamespace = io.of("/panel");
    const containerNamespace = io.of("/container");
    const alertNamespace = io.of("/alert");
    const bugNamespace = io.of("/bug");
    const strategiesNamespace = io.of("/strategies");
    const userNamespace = io.of("/user");
    const systemNamespace = io.of("/system");

    containerNamespace.on("connection", (socket) => {
        containerHandler(containerNamespace, socket);
    });

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

    systemNamespace.on("connection", (socket) => {
        systemHandler(systemNamespace, socket);
    });
    return io;
};

module.exports = bugSocket;
