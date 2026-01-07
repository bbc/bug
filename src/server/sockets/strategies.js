const strategyList = require("@services/strategy-list");
const logger = require("@utils/logger")(module);

let strategies;
let timer;
let listeningSocketIds = [];

module.exports = (namespace, socket) => {
    const onSocket = async () => {
        logger.debug(`socket id ${socket.id} subscribed to strategyList.`);
        listeningSocketIds.push(socket.id);
        socket.emit("event", await wrapStrategyList());
    };

    const wrapStrategyList = async () => {
        let response;
        try {
            response = {
                status: "success",
                data: await strategyList(),
            };
        } catch (error) {
            response = {
                status: "error",
                message: "Failed to list strategies",
            };
        }
        return response;
    };

    const poll = async () => {
        const newStrategies = await wrapStrategyList();
        if (JSON.stringify(strategies) !== JSON.stringify(newStrategies)) {
            strategies = newStrategies;
            namespace.emit("event", newStrategies);
        }
        timer = setTimeout(poll, 2000);
    };

    if (listeningSocketIds.length === 0) {
        // start the poll
        poll();
    }

    // when the client disconnects
    socket.on("disconnect", () => {
        // remove the socket ID from the array
        listeningSocketIds.splice(listeningSocketIds.indexOf(socket.id), 1);
        logger.debug(`socket id ${socket.id} unsubscribed from strategyList.`);
        // if we're the last one, stop the timer
        if (listeningSocketIds.length === 0) {
            logger.debug(`socket id ${socket.id} stopped the timer.`);
            clearTimeout(timer);
        }
    });

    onSocket();
};
