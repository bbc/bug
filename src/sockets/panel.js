const panelGet = require("@services/panel-get");
const logger = require("@utils/logger")(module);

let panels = {};
let enablePanelPoll = {};
let panelTimers = {};

module.exports = (namespace, socket) => {
    // let lastPanelId;

    const wrapPanel = async (panelId) => {
        try {
            return {
                status: "success",
                data: await panelGet(panelId),
            };
        } catch (error) {
            return {
                status: "error",
                message: `Failed to get panel ${panelId}`,
            };
        }
    };

    const poll = async (panelId) => {
        // just in case
        clearTimeout(panelTimers[panelId]);

        if (panelId) {
            // fetch the panel
            const newPanel = await wrapPanel(panelId);

            // see if it's changed
            if (JSON.stringify(panels[panelId]) !== JSON.stringify(newPanel)) {
                // save for next time
                panels[panelId] = newPanel;

                // send it out
                namespace.to(`panelId:${panelId}`).emit("event", newPanel);
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
            logger.debug(`socket id ${socket.id} started polling ${elements[1]}`);

            // toggle the enabled flag
            enablePanelPoll[elements[1]] = true;

            // start the regular timer to poll panel
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
            logger.debug(`socket id ${socket.id} stopped polling ${elements[1]}`);
            enablePanelPoll[elements[1]] = false;

            // if the timer is valid (it was probably)
            if (panelTimers[elements[1]]) {
                clearTimeout(panelTimers[elements[1]]);
            }
        }
    });

    socket.on("subscribe", async (panelId) => {
        if (panelId) {
            // we store this in case the client gets disconnected - it's the last panel id they were looking at
            socket.data.lastPanelId = panelId;

            logger.debug(`socket id ${socket.id} subscribed to panelId ${panelId}`);

            // join the room
            socket.join(`panelId:${panelId}`);

            // send a new update to the room (cos this client is waiting for it)
            panels[panelId] = await wrapPanel(panelId);
            socket.emit("event", panels[panelId]);
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
        if (socket.data.lastPanelId) {
            // clear socket id from list and check if timer needs stopping
            logger.debug(`socket id ${socket.id} unsubscribed from paneId ${socket.data.lastPanelId}`);
            socket.leave(`panelId:${socket.data.lastPanelId}`);
        }
    });
};
