const getSystemSettings = require("@services/system-settings-get");
const global = require("@utils/globalEmitter");

const systemHandler = (namespace, socket) => {
    //Function to request the system settings
    socket.on("settings", async (data) => {
        const settings = await getSystemSettings();
        socket.emit("settings", { status: settings ? "success" : "failure", data: settings?.data });
    });

    //Whenver the setting are changed on the server side broadcast the changes
    global.on("settings", (settings) => {
        socket.broadcast.emit("settings", { status: settings ? "success" : "failure", data: settings });
    });
};

module.exports = systemHandler;
