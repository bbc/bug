const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const customLogFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        info => `${info.timestamp} ${info.level}:\t${info.message}`,
    )
);

const logFolder = process.env.LOG_FOLDER || 'logs';
const logName = process.env.LOG_NAME || 'bug-core';

const logger = winston.createLogger(
    {
        level: 'debug',
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
        ],
    }
);

var consoleLogLevel = process.env.CONSOLE_LOGLEVEL || 'info';
consoleLogLevel = consoleLogLevel.toLowerCase();

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: consoleLogLevel,
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.simple()
        ),
        colorize: true,
    }));
}

module.exports = logger;