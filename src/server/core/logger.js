const winston = require("winston");
const path = require("path");

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
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

const loggerInstance = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                customLogFormat,
                winston.format.colorize({ all: true })
            ),
        }),
    ],
});

const logger = (module) => {
    const filename = path.basename(module.filename);
    const loggers = {};

    for (let level in customLevels.levels) {
        loggers[level] = (...args) => {
            const message = args
                .map((arg) => {
                    if (typeof arg === "string") return arg;
                    if (arg instanceof Error) return arg.stack || arg.message;
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return String(arg);
                    }
                })
                .join(" ");

            loggerInstance[level](`${filename}: ${message}`);
        };
    }

    return loggers;
};

module.exports = logger;