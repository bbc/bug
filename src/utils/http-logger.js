const morgan = require("morgan");
const logger = require("@utils/logger")(module);

logger.stream = {
    write: (message) => logger.http(message.substring(0, message.lastIndexOf("\n"))),
};

module.exports = morgan(`:remote-addr :method :url :status :res[content-length] - :response-time ms`, {
    stream: logger.stream,
});
