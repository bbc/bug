"use strict";

const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");
const writeJson = require("@core/write-json");
const path = require("path");

const filename = path.join(
    __dirname,
    "..",
    "config",
    "global",
    "strategies.json"
);

async function getStrategyIndex(strategies, name) {
    if (strategies && name) {
        const index = await strategies
            .map(function (strategy) {
                return strategy?.name;
            })
            .indexOf(name);
        return index;
    }
    return -1;
}

async function getStrategies() {
    try {
        const contents = await readJson(filename);
        return contents;
    } catch (error) {
        const contents = [
            { name: "local", settings: {}, active: "disabled" },
            { name: "saml", settings: {}, active: "disabled" },
            { name: "pin", settings: {}, active: "disabled" },
            { name: "proxy", settings: {}, active: "disabled" },
        ];
        if (await writeJson(filename, contents)) {
            return contents;
        }
        throw error;
    }
}

exports.list = async function () {
    try {
        return await getStrategies();
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.get = async function (name) {
    try {
        const strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, name);
        if (index === -1) {
            return null;
        }
        return strategies[index];
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.delete = async function (name) {
    try {
        const strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, name);
        if (index === -1) {
            return null;
        }
        strategies.splice(index, 1);
        return await writeJson(filename, strategies);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.set = async function (strategy) {
    try {
        let strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, strategy?.name);
        if (index !== -1) {
            strategies[index] = strategy;
        } else {
            strategies.push(strategy);
        }

        return await writeJson(filename, strategies);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.update = async function (strategy) {
    try {
        let strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, strategy?.name);
        if (index !== -1) {
            strategies[index] = { ...strategies[index], ...strategy };
        } else {
            return null;
        }

        return await writeJson(filename, strategies);
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};
