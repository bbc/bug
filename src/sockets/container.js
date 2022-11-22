//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DESC: Proxies Websockets connections to individual containers in a similiar method to HTTP proxying

const getPanel = require("@services/panel-get");
const logger = require("@utils/logger")(module);
const { io } = require("socket.io-client");

const containerSockets = {};

//Client subscribes to panelID
//BUG Core opens socket connection to container if not already in existance.
//Any requests to the panel's room are passed directly on to the open client.
//On initial create we subscirbe to all events from the container. On event this is broadcast to the room.

module.exports = (namespace, socket) => {
    let lastPanelId;

    const wrapPanelConfig = async (panelId) => {
        let response;
        try {
            response = {
                status: "success",
                data: await getPanelConfig(panelId),
            };
        } catch (error) {
            response = {
                status: "error",
                message: `Failed to get ${panelId} config`,
            };
        }
        return response;
    };

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
        if (elements.length !== 2) {
            return;
        }

        if (elements[0] !== "panelId") {
            return;
        }

        const panelId = elements[1];
        const panel = await getPanel(panelId);

        //TODO - CHECK IF PANEL CONTAINER IS RUNNING
        if (panel) {
            containerSockets[panelId] = io(`ws://{elements[1]}`, { forceNew: true, transports: ["websocket"] });

            containerSockets[panelId].on("connect", () => {
                logger.debug(`Websocket connection established to panelId ${panelId}`);
            });

            containerSockets[panelId].on("data", (data) => {
                namespace.to(room).emit("data", data);
            });
        }
    });

    namespace.adapter.on("delete-room", (room) => {
        // this may be a panel or the default room for each socket
        const elements = room.split(":");
        if (elements.length !== 2) {
            return;
        }

        if (elements[0] !== "panelId") {
            return;
        }

        if (enablePanelPoll[elements[1]]) {
            logger.debug(`socket id ${socket.id} stopped polling ${elements[1]}`);
            enablePanelPoll[elements[1]] = false;
            // if the timer is valid (it was probably
            if (panelTimers[elements[1]]) {
                clearTimeout(panelTimers[elements[1]]);
            }
        }
    });

    socket.on("subscribe", async (panelId) => {
        if (panelId) {
            // we store this in case the client gets disconnected - it's the last panel id they were looking at
            lastPanelId = panelId;
            logger.debug(`socket id ${socket.id} subscribed to paneId ${panelId}`);

            // join the room
            socket.join(`panelId:${panelId}`);

            // send a new update to the room (cos this client is waiting for it)
            const newConfig = await wrapPanelConfig(panelId);
            socket.emit("event", newConfig);
        }
    });

    socket.on("unsubscribe", async (panelId) => {
        if (panelId) {
            // leave the room
            logger.debug(`socket id ${socket.id} unsubscribed from panelId ${panelId}`);
            socket.leave(`panelId:${panelId}`);
        }
    });

    socket.on("disconnect", () => {
        if (lastPanelId) {
            // clear socket id from list and check if timer needs stopping
            logger.debug(`socket id ${socket.id} unsubscribed from panelId ${lastPanelId}`);
            socket.leave(`panelId:${lastPanelId}`);
        }
    });

    socket.on("data", (data) => {
        containerSockets[panelId].emit("data", data);
    });
};
