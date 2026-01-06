const morgan = require("morgan");
const logger = require("@utils/logger")(module);

logger.stream = {
    write: (message) => {
        message = message.substring(0, message.lastIndexOf("\n"));
        const items = message.split(" ");
        logger.http(message, { remoteAddress: items[0] });
    },
};

module.exports = morgan(`:remote-addr :method :url :status :res[content-length] :response-time ms`, {
    stream: logger.stream,
});
