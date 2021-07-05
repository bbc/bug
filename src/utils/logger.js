const winston = require("winston");
require("winston-daily-rotate-file");
require("winston-mongodb");
const path = require("path");

const logFolder = process.env.BUG_CORE_LOG_FOLDER || "logs";
const logName = process.env.BUG_CORE_LOG_NAME || "bug-core";

const customLevels = {
    levels: {
        error: 0,
        warning: 1,
        action: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        error: "red",
        warning: "yellow",
        action: "green",
        info: "blue",
        http: "magenta",
        debug: "gray",
    },
};

const httpFilter = winston.format((log, opts) => {
    return log.level === "http" ? log : false;
});

const actionFilter = winston.format((log, opts) => {
    return log.level === "action" ? log : false;
});

const customLogFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf((log) => `${log.timestamp} ${log.level}${log.message}`)
);

winston.addColors(customLevels.colors);

const loggerInstance = winston.createLogger({
    level: "debug",
    levels: customLevels.levels,
    handleExceptions: false,
    transports: [
        new winston.transports.DailyRotateFile({
            level: "warning",
            format: customLogFormat,
            filename: path.join(logFolder, logName + "-warning-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "200m",
            maxFiles: "7d",
        }),
        new winston.transports.DailyRotateFile({
            level: "info",
            format: customLogFormat,
            filename: path.join(logFolder, logName + "-info-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "200m",
            maxFiles: "2d",
        }),
        new winston.transports.DailyRotateFile({
            level: "debug",
            format: customLogFormat,
            filename: path.join(logFolder, logName + "-debug-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "200m",
            maxFiles: "1d",
        }),
        new winston.transports.DailyRotateFile({
            level: "http",
            format: customLogFormat,
            filename: path.join(logFolder, logName + "-http-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "200m",
            maxFiles: "1d",
        }),
        new winston.transports.DailyRotateFile({
            level: "action",
            format: customLogFormat,
            filename: path.join(logFolder, logName + "-action-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "200m",
            maxFiles: "1d",
        }),
        new winston.transports.MongoDB({
            level: "info",
            db: "mongodb://bug-mongo:27017/bug-core",
            options: {
                poolSize: 2,
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            collection: "logs",
            label: "n/a",
            name: "action",
            cappedMax: 5000,
        }),
    ],
});

let consoleLogLevel = process.env.BUG_CORE_CONSOLE_LEVEL || "info";
consoleLogLevel = consoleLogLevel.toLowerCase();

if (process.env.NODE_ENV !== "production") {
    loggerInstance.add(
        new winston.transports.Console({
            level: consoleLogLevel,
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
        loggers[level] = (message) => {
            loggerInstance[level](`: (${filename}) ${message}`);
        };
    }

    return loggers;
};

module.exports = logger;
