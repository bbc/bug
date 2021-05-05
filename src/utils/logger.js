const winston = require('winston');
require('winston-daily-rotate-file');
require('winston-mongodb');
const path = require('path');

const customLevels = {
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        action: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        error: 'red',
        warning: 'yellow',
        info: 'green',
        action: 'blue',
        http: 'magenta',
        debug: 'gray',
    }
};

winston.addColors(customLevels.colors);

const customLogFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        log => `${log.timestamp} ${log.level}:\t${log.message}`,
    )
);

const logFolder = process.env.BUG_CORE_LOG_FOLDER || 'logs';
const logName = process.env.BUG_CORE_LOG_NAME || 'bug-core';

const logger = winston.createLogger(
    {
        level: 'debug',
        levels: customLevels.levels,
        handleExceptions: false,
        transports: [
            new winston.transports.DailyRotateFile({
                level: 'warning',
                format: customLogFormat,
                filename: path.join(logFolder, logName + '-WARNING-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '200m',
                maxFiles: '7d'
            }),
            new winston.transports.DailyRotateFile({
                level: 'info',
                format: customLogFormat,
                filename: path.join(logFolder, logName + '-INFO-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '200m',
                maxFiles: '2d'
            }),
            new winston.transports.DailyRotateFile({
                level: 'debug',
                format: customLogFormat,
                filename: path.join(logFolder, logName + '-DEBUG-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '200m',
                maxFiles: '1d'
            }),
            new winston.transports.DailyRotateFile({
                level: 'http',
                format: customLogFormat,
                filename: path.join(logFolder, logName + '-HTTP-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '200m',
                maxFiles: '1d'
            }),
            new winston.transports.DailyRotateFile({
                level: 'action',
                format: customLogFormat,
                filename: path.join(logFolder, logName + '-ACTION-%DATE%.log'),
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '200m',
                maxFiles: '1d'
            }),
            new winston.transports.MongoDB({
                level: 'action',
                db: 'mongodb://bug-mongo:27017/bug-logs',
                options:{poolSize: 2, useUnifiedTopology: true, useNewUrlParser: true},
                collection:'action',
                name: 'action',
                cappedMax: 5000
            })
        ],
    }
);

let consoleLogLevel = process.env.BUG_CORE_CONSOLE_LEVEL || 'info';
consoleLogLevel = consoleLogLevel.toLowerCase();

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: consoleLogLevel,
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.simple(),
            winston.format.colorize({all:true}),
        ),
        colorize: true,
    }));
}

module.exports = logger;