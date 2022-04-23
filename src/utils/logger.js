const winston = require("winston");
require("winston-daily-rotate-file");
require("winston-mongodb");
const path = require("path");
const global = require("@utils/globalEmitter");
const readJson = require("@core/read-json");
const logFolder = process.env.BUG_LOG_FOLDER || "logs";
const logName = process.env.BUG_LOG_NAME || "bug";
const databaseName = process.env.BUG_CONTAINER || "bug";

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

const customLogFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf((log) => `${log.timestamp} ${log.level}: ${log.message}`)
);

winston.addColors(customLevels.colors);

const loggerInstance = winston.createLogger({
    levels: customLevels.levels,
    handleExceptions: false,
    transports: [
        new winston.transports.DailyRotateFile({
            level: logLevel,
            format: customLogFormat,
            filename: path.join(logFolder, logName + "-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "100m",
            maxFiles: "1d",
        }),
        new winston.transports.MongoDB({
            level: logLevel,
            db: `mongodb://bug-mongo:27017/${databaseName}`,
            options: {
                poolSize: 2,
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            collection: "logs",
            cappedMax: 10000,
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    loggerInstance.add(
        new winston.transports.Console({
            level: logLevel,
            handleExceptions: true,
            colorize: true,
            format: winston.format.combine(customLogFormat, winston.format.colorize({ all: true })),
        })
    );
}

const logger = (module) => {
    const filename = path.basename(module.filename);
    const loggers = {};

    for (let level in customLevels?.levels) {
        loggers[level] = (message, metadata) => {
            loggerInstance[level](message, { metadata: { ...{ filename: filename }, ...metadata } });
        };
    }

    return loggers;
};

const getLogLevel = async () => {
    let settingsLogLevel;
    try {
        const filename = path.join(__dirname, "..", "config", "global", "settings.json");
        const settings = await readJson(filename);
        settingsLogLevel = settings?.logLevel;
    } catch (error) {
        console.log(error);
        settingsLogLevel = process.env.BUG_LOG_LEVEL || "debug";
    }
    return settingsLogLevel.toLowerCase();
};

const setLogLevel = (level) => {
    for (let transport of loggerInstance.transports) {
        transport.level = level;
    }
};

const initLogLevel = async () => {
    const firstLogLevel = await getLogLevel();
    if (firstLogLevel) {
        logLevel = firstLogLevel;
    }
    setLogLevel(logLevel);
};

//Global Event on settings change to update the log level
global.on("settings", async (settings) => {
    if (settings.logLevel) {
        logLevel = settings.logLevel;
        setLogLevel(logLevel);
    }
});

initLogLevel();

module.exports = logger;
