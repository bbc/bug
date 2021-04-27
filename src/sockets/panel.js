const panelList = require('@services/panel-list');
const { response } = require('../bin/bug-core-api');

let interval;
let panels;

const getPanelList = async () => {
    let response;
    try {
        response = {
            status: "success",
            data: await panelList()
        }
    } catch (error) {
        response = {
            status: "error",
            message: "Failed to list panels"
        }
    }
    return response
}

const panelHandler = (io, socket) => {


    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(async () => {
        const newPanels = await getPanelList();
        if (JSON.stringify(panels) !== JSON.stringify(newPanels)) {
            panels = newPanels;
            io.emit('panel', panels)
        }
    }, 1000);

    socket.on('panel', async () => {
        socket.emit('panel', await getPanelList());
    });

    socket.on("disconnect", () => {
        clearInterval(interval);
    });
}

module.exports = panelHandler;