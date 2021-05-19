const getPanelConfig = require("@services/panel-configget");

let panelConfigs = {};
let enablePanelPoll = {};
let panelTimers = {};

module.exports = (io, socket) => {
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
            console.log("ping", panelId);
            // see if it's changed
            if (JSON.stringify(panelConfigs[panelId]) !== JSON.stringify(newPanelConfig)) {
                // save for next time
                panelConfigs[panelId] = newPanelConfig;

                // send it out
                io.to(`panelConfig:${panelId}`).emit("panelConfig", newPanelConfig);
            }
        }

        // we check this to prevent race conditions
        // (where the room has been deleted while we've been running the previous steps)
        if (enablePanelPoll[panelId]) {
            panelTimers[panelId] = setTimeout(() => poll(panelId), 1000);
        } else {
            console.log(`room for panel id ${panelId} has been disabled - not restarting timer`);
        }
    };

    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });

    io.of("/").adapter.on("leave-room", (room, id) => {
        console.log(`socket ${id} has left room ${room}`);
    });

    io.of("/").adapter.on("create-room", (room) => {
        const elements = room.split(":");
        if (elements.length !== 2) {
            return;
        }

        if (elements[0] !== "panelConfig") {
            return;
        }

        // toggle the enabled flag
        enablePanelPoll[elements[1]] = true;

        // start the regular timer to poll config
        poll(elements[1]);
    });

    io.of("/").adapter.on("delete-room", (room) => {
        // this may be a panel or the default room for each socket
        const elements = room.split(":");
        if (elements.length !== 2) {
            return;
        }

        if (elements[0] !== "panelConfig") {
            return;
        }

        enablePanelPoll[elements[1]] = false;

        // if the timer is valid (it was probably
        if (panelTimers[elements[1]]) {
            clearTimeout(panelTimers[elements[1]]);
        }
    });

    socket.on("panelConfig:join", async (panelId) => {
        if (panelId) {
            // we store this in case the client gets disconnected - it's the last panel id they were looking at
            lastPanelId = panelId;

            console.log(`joining room panelConfig:${panelId}`);

            // join the room
            socket.join(`panelConfig:${panelId}`);

            // send a new update to the room (cos this client is waiting for it)
            const newConfig = await wrapPanelConfig(panelId);
            io.to(`panelConfig:${panelId}`).emit("panelConfig", newConfig);
        }
    });

    socket.on("panelConfig:leave", async (panelId) => {
        console.log("received panelconfig:leave for panel id ", panelId);
        if (panelId) {
            // leave the room
            console.log(`leaving ${panelId}`);
            socket.leave(`panelConfig:${panelId}`);
        }
    });

    socket.on("disconnect", () => {
        if (lastPanelId) {
            // clear socket id from list and check if timer needs stopping
            console.log(`leaving ${lastPanelId}`);
            socket.leave(`panelConfig:${lastPanelId}`);
        }
    });
};
