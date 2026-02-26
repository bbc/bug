"use strict";

const logger = require("@core/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");

const filename = path.join(__dirname, "..", "..", "..", "config", "global", "strategies.json");
const defaultFilename = path.join(__dirname, "..", "..", "..", "config", "default", "strategies.json");

async function getStrategyIndex(strategies, type) {
    if (strategies && type) {
        return strategies.map(s => s?.type).indexOf(type);
    }
    return -1;
}

async function getStrategies() {
    try {
        return await readJson(filename);
    } catch (err) {
        try {
            const contents = await readJson(defaultFilename);
            await writeJson(filename, contents);
            return contents;
        } catch (writeErr) {
            writeErr.message = `getStrategies: ${writeErr.message}`;
            logger.error(writeErr.stack || writeErr.message);
            throw writeErr;
        }
    }
}

exports.list = async function () {
    try {
        return await getStrategies();
    } catch (err) {
        err.message = `strategies-list: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.get = async function (type) {
    try {
        const strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, type);
        if (index === -1) return null;
        return strategies[index];
    } catch (err) {
        err.message = `strategies-get: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.delete = async function (type) {
    try {
        const strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, type);
        if (index === -1) return null;
        strategies.splice(index, 1);
        return await writeJson(filename, strategies);
    } catch (err) {
        err.message = `strategies-delete: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.set = async function (strategy) {
    try {
        let strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, strategy?.type);
        if (index !== -1) {
            strategies[index] = strategy;
        } else {
            strategies.push(strategy);
        }
        return await writeJson(filename, strategies);
    } catch (err) {
        err.message = `strategies-set: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.setAll = async function (strategies) {
    try {
        return await writeJson(filename, strategies);
    } catch (err) {
        err.message = `strategies-setAll: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};

exports.update = async function (type, strategy) {
    try {
        let strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, type);
        if (index === -1) return null;
        strategies[index] = { ...strategies[index], ...strategy };
        return await writeJson(filename, strategies);
    } catch (err) {
        err.message = `strategies-update: ${err.message}`;
        logger.error(err.stack || err.message);
        throw err;
    }
};