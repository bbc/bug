const panelList = require("@services/panel-list");
const logger = require("@utils/logger")(module);

let panels;
let timer;
let listeningSocketIds = [];

module.exports = (namespace, socket) => {
    const onSocket = async () => {
        logger.debug(`socket id ${socket.id} subscribed to panelList.`);
        listeningSocketIds.push(socket.id);
        socket.emit("event", await wrapPanelList());
    };

    const wrapPanelList = async () => {
        let response;
        try {
            response = {
                status: "success",
                data: await panelList(),
            };
        } catch (error) {
            response = {
                status: "error",
                message: "Failed to list panels",
            };
        }
        return response;
    };

    const poll = async () => {
        const newPanels = await wrapPanelList();
        if (JSON.stringify(panels) !== JSON.stringify(newPanels)) {
            panels = newPanels;
            namespace.emit("event", newPanels);
        }
        timer = setTimeout(poll, 1000);
    };

    if (listeningSocketIds.length === 0) {
        // start the poll
        poll();
    }

    // when the client disconnects
    socket.on("disconnect", () => {
        // remove the socket ID from the array
        listeningSocketIds.splice(listeningSocketIds.indexOf(socket.id), 1);
        logger.debug(`socket id ${socket.id} unsubscribed from panelList.`);
        // if we're the last one, stop the timer
        if (listeningSocketIds.length === 0) {
            logger.debug(`socket id ${socket.id} stopped the timer.`);
            clearTimeout(timer);
        }
    });

    onSocket();
};
