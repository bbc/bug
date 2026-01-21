const getPanel = require("@services/panel-get");
const getPanelConfig = require("@services/panelconfig-get");
const logger = require("@utils/logger")(module);
const { io } = require("socket.io-client");

const containerSockets = {};
const panelTimers = {};
const enablePanelPoll = {};

// client subscribes to panelID
// BUG Core opens socket connection to container if not already in existance.
// any requests to the panel's room are passed directly on to the open client.
// on initial create we subscirbe to all events from the container. On event this is broadcast to the room.

const setupAdapterListeners = (namespace) => {
    // prevent re-attaching if this function is called again
    if (namespace.adapter._isInitialized) return;
    namespace.adapter._isInitialized = true;

    namespace.adapter.on("join-room", (room, id) => {
        const roomElements = room.split(":");
        if (roomElements[0] === "panelId") {
            logger.debug(`socket id ${id} joined room ${roomElements[1]}`);
        }
    });

    namespace.adapter.on("leave-room", (room, id) => {
        const roomElements = room.split(":");
        if (roomElements[0] === "panelId") {
            logger.debug(`socket id ${id} left room ${roomElements[1]}`);
        }
    });

    namespace.adapter.on("create-room", async (room) => {
        const elements = room.split(":");
        if (elements.length !== 2 || elements[0] !== "panelId") return;

        const panelId = elements[1];

        // prevent duplicate container connections if the room is re-created
        if (containerSockets[panelId]) return;

        const panel = await getPanel(panelId);

        //TODO - CHECK IF PANEL CONTAINER IS RUNNING
        if (panel) {
            logger.info(`Opening container connection for panelId: ${panelId}`);

            containerSockets[panelId] = io(`ws://${panelId}`, {
                forceNew: true,
                transports: ["websocket"]
            });

            containerSockets[panelId].on("connect", () => {
                logger.debug(`Websocket connection established to panelId ${panelId}`);
            });

            containerSockets[panelId].on("data", (data) => {
                namespace.to(room).emit("data", data);
            });

            containerSockets[panelId].on("error", (err) => {
                logger.error(`Container socket error for ${panelId}:`, err);
            });
        }
    });

    namespace.adapter.on("delete-room", (room) => {
        // this may be a panel or the default room for each socket
        const elements = room.split(":");
        if (elements.length !== 2 || elements[0] !== "panelId") return;

        const panelId = elements[1];

        // cleanup polling
        if (enablePanelPoll[panelId]) {
            logger.debug(`Room ${room} deleted: stopping polling`);
            enablePanelPoll[panelId] = false;
            if (panelTimers[panelId]) {
                clearTimeout(panelTimers[panelId]);
                delete panelTimers[panelId];
            }
        }

        // cleanup container connection when no one is left in the room
        if (containerSockets[panelId]) {
            logger.info(`Closing container connection for panelId: ${panelId} (Room empty)`);
            containerSockets[panelId].disconnect();
            delete containerSockets[panelId];
        }
    });
};

// per-socket handler - this is exported and called every time a new client connects.
module.exports = (namespace, socket) => {
    // initialize the global adapter listeners once
    setupAdapterListeners(namespace);

    let lastPanelId;

    const wrapPanelConfig = async (panelId) => {
        try {
            const config = await getPanelConfig(panelId); // Assuming getPanelConfig was intended to be getPanel or similar
            return {
                status: "success",
                data: config,
            };
        } catch (error) {
            return {
                status: "error",
                message: `Failed to get ${panelId} config`,
            };
        }
    };

    // socket-specific listeners
    socket.on("subscribe", async (panelId) => {
        if (panelId) {
            // we store this in case the client gets disconnected - it's the last panel id they were looking at
            lastPanelId = panelId;
            logger.debug(`socket id ${socket.id} subscribed to panelId ${panelId}`);

            // join the room
            socket.join(`panelId:${panelId}`);

            // send a new update to the room (cos this client is waiting for it)
            const newConfig = await wrapPanelConfig(panelId);
            socket.emit("event", newConfig);
        }
    });

    socket.on("unsubscribe", (panelId) => {
        if (panelId) {
            // clear socket id from list and check if timer needs stopping
            logger.debug(`socket id ${socket.id} unsubscribed from panelId ${panelId}`);
            socket.leave(`panelId:${panelId}`);
        }
    });

    socket.on("data", (data) => {
        // Use the panelId from the specific socket context
        if (lastPanelId && containerSockets[lastPanelId]) {
            containerSockets[lastPanelId].emit("data", data);
        } else {
            logger.warn(`Data received for socket ${socket.id} but no active container connection.`);
        }
    });

    socket.on("disconnect", () => {
        if (lastPanelId) {
            logger.debug(`socket id ${socket.id} disconnected, leaving room ${lastPanelId}`);
            socket.leave(`panelId:${lastPanelId}`);
        }
    });
};