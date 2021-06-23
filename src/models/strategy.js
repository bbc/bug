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

async function getStrategyIndex(strategies, type) {
    if (strategies && type) {
        const index = await strategies
            .map(function (strategy) {
                return strategy?.type;
            })
            .indexOf(type);
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
            {
                type: "local",
                name: "Username and Password",
                settings: {},
                enabled: false,
            },
            { type: "saml", name: "SAML SSO", settings: {}, enabled: false },
            {
                type: "pin",
                name: "4-Digit Pin Code",
                settings: {},
                enabled: false,
            },
            {
                type: "proxy",
                name: "Reverse Proxy Header",
                settings: {},
                enabled: false,
            },
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

exports.get = async function (type) {
    try {
        const strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, type);
        if (index === -1) {
            return null;
        }
        return strategies[index];
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.delete = async function (type) {
    try {
        const strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, type);
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
        const index = await getStrategyIndex(strategies, strategy?.type);
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

exports.update = async function (type, strategy) {
    try {
        let strategies = await getStrategies();
        const index = await getStrategyIndex(strategies, type);
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
