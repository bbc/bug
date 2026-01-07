const getSystemSettings = require("@services/system-settings-get");
const systemInfo = require("@services/system-info");
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

    //Function to request the system info (Updates and running verion)
    socket.on("info", async (data) => {
        const info = await systemInfo();
        socket.emit("info", { status: info ? "success" : "failure", data: info?.data });
    });

    //Whenver the system info changes on the server side broadcast the changes
    global.on("info", async (data) => {
        console.log(data);
        console.log("Model fired event");
        const info = await systemInfo();
        socket.broadcast.emit("info", { status: info ? "success" : "failure", data: info?.data });
    });
};

module.exports = systemHandler;
