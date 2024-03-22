"use strict";

const prodigyPromise = require("./prodigy-promise");
const configGet = require("@core/config-get");

module.exports = async (obj, payload) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`prodigy-command: failed to fetch config`);
        return false;
    }

    const prodigy = new prodigyPromise({
        host: config.address,
        port: 5003,
    });

    await prodigy.connect();

    // now manage the command sending
    return new Promise(async (resolve, reject) => {
        const seq = Math.floor(Math.random() * 60000);

        const data = {
            type: "set",
            obj: obj,
            payload: payload,
            seq: seq,
        };

        let timer = setTimeout(() => {
            console.log("prodigy-command: timed out after 5 seconds");
            reject();
        }, 2000);

        prodigy.on("ack", (result) => {
            if (seq === result["seq"]) {
                console.log(`prodigy-command: command seq ${seq} acknowledged ok`);
                clearTimeout(timer);
                resolve(true);
            }
        });

        console.log(`prodigy-command: sending command ${JSON.stringify(data)}`);
        prodigy.send(JSON.stringify(data));
    });
};
