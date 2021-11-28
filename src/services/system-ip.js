"use strict";

const logger = require("@utils/logger")(module);
const dns = require("dns");

// const { networkInterfaces } = require("os");

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
        // const nets = networkInterfaces();
        // const response = {};

        // for (const name of Object.keys(nets)) {
        //     for (const net of nets[name]) {
        //         if (net.family === "IPv4" && !net.internal) {
        //             if (!response[name]) {
        //                 response[name] = [];
        //             }
        //             response[name].push(net.address);
        //         }
        //     }
        // }

        const response = await lookupPromise("host.docker.internal");
        console.log(response);

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve system IP.`);
    }
};
