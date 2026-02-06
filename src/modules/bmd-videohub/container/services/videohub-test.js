"use strict";

const videohub = require("@utils/videohub-promise");
const logger = require("@core/logger")(module);

module.exports = async (address, port) => {
    try {
        // validate inputs
        if (!address) throw new Error("missing host address");
        if (!port) throw new Error("missing port number");

        // create router instance
        const router = new videohub({ host: address, port: port });

        // connect to router
        await router.connect();
        logger.info(`videohub-ping: connected to ${address}:${port}`);

        // return a promise that resolves on first update or after max retries
        return await new Promise((resolve) => {
            // resolve on update event
            router.on("update", () => {
                logger.info("videohub-ping: received update from router");
                resolve(true);
            });

            // attempt up to 5 pings
            let count = 0;
            const sendPing = () => {
                if (count < 5) {
                    count += 1;
                    router.send("PING", null, true);
                    setTimeout(sendPing, 200);
                } else {
                    logger.warning("videohub-ping: no response after 5 attempts");
                    resolve(false);
                }
            };
            sendPing();
        });

    } catch (err) {
        err.message = `videohub-ping: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
