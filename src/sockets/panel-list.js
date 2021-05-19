const panelList = require("@services/panel-list");

let panels;
let timer;
let listeningSocketIds = [];

module.exports = (io, socket) => {
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
            io.emit("panelList", newPanels);
        }
        timer = setTimeout(poll, 1000);
    };

    if (listeningSocketIds.length === 0) {
        // start the poll
        poll();
    }

    // when the client requests a panel list
    socket.on("panelList", async () => {
        // save the ID in an array
        listeningSocketIds.push(socket.id);

        // send the response (just to the sender)
        socket.emit("panelList", await wrapPanelList());
    });

    // when the client disconnects
    socket.on("disconnect", () => {
        // remove the socket ID from the array
        listeningSocketIds.splice(listeningSocketIds.indexOf(socket.id), 1);

        // if we're the last one, stop the timer
        if (listeningSocketIds.length === 0) {
            clearTimeout(timer);
        }
    });
};
