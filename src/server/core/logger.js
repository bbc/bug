/**
 * core/logger.js
 * Logger for BUG app server using winston
 * 0.0.1 09/08/2023 - Created first version (RM)
 */

const winston = require("winston");
const panelId = process.env.PANEL_ID || "";
const moduleName = process.env.MODULE || "";
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
        new winston.transports.Console({
            handleExceptions: true,
            colorize: true,
            format: winston.format.combine(customLogFormat, winston.format.colorize({ all: true })),
        }),
    ],
});

const logger = (module) => {
    const filename = path.basename(module.filename);
    const loggers = {};

    for (let level in customLevels?.levels) {
        loggers[level] = (message, metadata) => {
            loggerInstance[level](message, {
                metadata: { ...{ panel: panelId, module: moduleName, filename: filename }, ...metadata },
            });
        };
    }

    return loggers;
};

module.exports = logger;
