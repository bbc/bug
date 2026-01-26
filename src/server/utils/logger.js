const winston = require("winston");
const global = require("@utils/globalEmitter");
const readJson = require("@core/read-json");

let logLevel = "info";

const customLevels = {
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "magenta",
        debug: "gray",
    },
};

winston.addColors(customLevels.colors);

const customLogFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf((log) => `${log.timestamp} ${log.level}: ${log.message}`)
);

const loggerInstance = winston.createLogger({
    levels: customLevels.levels,
    handleExceptions: false,
    transports: [
        new winston.transports.Console({
            level: logLevel,
            handleExceptions: true,
            format: winston.format.combine(
                customLogFormat,
                winston.format.colorize({ all: true })
            ),
        }),
    ],
});

// factory function to create loggers
const logger = () => {
    const loggers = {};
    for (let level in customLevels.levels) {
        loggers[level] = (message, metadata) => {
            loggerInstance[level](message, { metadata });
        };
    }
    return loggers;
};

// read log level from global settings or environment
const getLogLevel = async () => {
    try {
        const settings = await readJson(
            require("path").join(__dirname, "..", "config", "global", "settings.json")
        );
        return (settings?.logLevel || process.env.BUG_LOG_LEVEL || "debug").toLowerCase();
    } catch {
        return (process.env.BUG_LOG_LEVEL || "debug").toLowerCase();
    }
};

// update all transports with new log level
const setLogLevel = (level) => {
    loggerInstance.transports.forEach((transport) => (transport.level = level));
};

// initialize log level
const initLogLevel = async () => {
    logLevel = await getLogLevel();
    setLogLevel(logLevel);
};

// listen for dynamic settings changes
global.on("settings", async (settings) => {
    if (settings.logLevel) {
        logLevel = settings.logLevel;
        setLogLevel(logLevel);
    }
});

initLogLevel();

module.exports = logger;
