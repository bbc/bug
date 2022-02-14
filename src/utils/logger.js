const winston = require("winston");
require("winston-daily-rotate-file");
require("winston-mongodb");
const path = require("path");
const readJson = require("@core/read-json");

const logFolder = process.env.BUG_LOG_FOLDER || "logs";
const logName = process.env.BUG_LOG_NAME || "bug";
const databaseName = process.env.BUG_CONTAINER || "bug";

let logLevel = process.env.BUG_LOG_LEVEL || "debug";
logLevel = logLevel.toLowerCase();

async function getSettings() {
    const filename = path.join(__dirname, "..", "config", "global", "settings.json");
    const defaultFilename = path.join(__dirname, "..", "config", "default", "settings.json");
    try {
        return await readJson(filename);
    } catch (error) {
        const contents = await readJson(defaultFilename);
        if (await writeJson(filename, contents)) {
            return contents;
        }
        throw error;
    }
}

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

const customLogFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf((log) => `${log.timestamp} ${log.level}: ${log.message}`)
);

winston.addColors(customLevels.colors);

const loggerInstance = winston.createLogger({
    level: logLevel,
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
            cappedMax: 5000,
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

module.exports = logger;
