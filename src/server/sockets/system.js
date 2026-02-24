const getSystemSettings = require("@services/system-settings-get");
const systemInfo = require("@services/system-info");
const global = require("@utils/globalEmitter");
const logger = require("@core/logger")(module);

const systemHandler = (namespace, socket) => {
    // function to request the system settings
    socket.on("settings", async (data) => {
        const settings = await getSystemSettings();
        socket.emit("settings", { status: settings ? "success" : "failure", data: settings?.data });
    });

    // whenver the setting are changed on the server side broadcast the changes
    global.on("settings", (settings) => {
        socket.broadcast.emit("settings", { status: settings ? "success" : "failure", data: settings });
    });

    // function to request the system info (Updates and running verion)
    socket.on("info", async (data) => {
        const info = await systemInfo();
        socket.emit("info", { status: info ? "success" : "failure", data: info?.data });
    });

    // whenver the system info changes on the server side broadcast the changes
    global.on("info", async (data) => {
        logger.info("sockets-system: model fired event");
        logger.info(JSON.stringify(data));
        const info = await systemInfo();
        socket.broadcast.emit("info", { status: info ? "success" : "failure", data: info?.data });
    });
};

module.exports = systemHandler;
