const systemLogs = require('@services/system-logs');
const { response } = require('@bin/api');

let interval;
let logs;

const getSystemLogs = async () => {
    let response;
    try {
        response = {
            status: "success",
            data: await systemLogs(),
        }
    } catch (error) {
        response = {
            status: "error",
            message: "Failed to list panels"
        }
    }
    return response
}

const logHandler = (io, socket) => {


    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(async () => {
        const newPanels = await getSystemLogs();
        if (JSON.stringify(panels) !== JSON.stringify(newPanels)) {
            panels = newPanels;
            io.emit('panel', panels)
        }
    }, 500);

    socket.on('logs', async () => {
        socket.emit('panel', await getSystemLogs());
    });

    socket.on("disconnect", () => {
        clearInterval(interval);
    });
}

module.exports = logHandler;