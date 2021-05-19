const getPanelConfig = require("@services/panel-configget");
const logger = require("@utils/logger")(module);

let panelConfigs = {};
let enablePanelPoll = {};
let panelTimers = {};

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

    const poll = async (panelId) => {
        // just in case
        clearTimeout(panelTimers[panelId]);

        if (panelId) {
            // fetch the config
            const newPanelConfig = await wrapPanelConfig(panelId);
            // see if it's changed
            if (
                JSON.stringify(panelConfigs[panelId]) !==
                JSON.stringify(newPanelConfig)
            ) {
                // save for next time
                panelConfigs[panelId] = newPanelConfig;

                // send it out
                namespace
                    .to(`panelId:${panelId}`)
                    .emit("event", newPanelConfig);
            }
        }

        // we check this to prevent race conditions
        // (where the room has been deleted while we've been running the previous steps)
        if (enablePanelPoll[panelId]) {
            panelTimers[panelId] = setTimeout(() => poll(panelId), 1000);
        } else {
            logger.debug(`socket id ${socket.id} stopped polling ${panelId}`);
        }
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

    namespace.adapter.on("create-room", (room) => {
        const elements = room.split(":");
        if (elements.length !== 2) {
            return;
        }

        if (elements[0] !== "panelId") {
            return;
        }

        if (!enablePanelPoll[elements[1]]) {
            logger.debug(
                `socket id ${socket.id} started polling ${elements[1]}`
            );

            // toggle the enabled flag
            enablePanelPoll[elements[1]] = true;

            // start the regular timer to poll config
            poll(elements[1]);
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
            logger.debug(
                `socket id ${socket.id} stopped polling ${elements[1]}`
            );
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
            logger.debug(
                `socket id ${socket.id} subscribed to paneId ${panelId}`
            );

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
            logger.debug(
                `socket id ${socket.id} unsubscribed from panelId ${panelId}`
            );
            socket.leave(`panelId:${panelId}`);
        }
    });

    socket.on("disconnect", () => {
        if (lastPanelId) {
            // clear socket id from list and check if timer needs stopping
            logger.debug(
                `socket id ${socket.id} unsubscribed from panelId ${lastPanelId}`
            );
            socket.leave(`panelId:${lastPanelId}`);
        }
    });
};
