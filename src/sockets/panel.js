const panelList = require('@services/panel-list');
const { response } = require('../bin/bug-core-api');

let interval;

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

    interval = setInterval(async () =>{
        io.emit('panel',await getPanelList())
    }, 1000);
    
    socket.on('panel',async () => {
        socket.emit('panel', await getPanelList());
    });

    socket.on("disconnect", () => {
        clearInterval(interval);
    });
}

module.exports = panelHandler;