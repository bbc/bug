"use strict";

const logger = require("@utils/logger")(module);
const dns = require("dns");

const bugHost = process.env.BUG_HOST;

async function lookupPromise(hostname) {
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, (err, address, family) => {
            if (err) reject(err);
            resolve(address);
        });
    });
}

module.exports = async () => {
    try {
        let response = bugHost;
        if (!response) {
            response = await lookupPromise("host.docker.internal");
        }
        return response;
    } catch (error) {
        logger.error(`system-ip: ${error.stack}`);
        throw new Error(`Failed to retrieve system IP.`);
    }
};
