"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ mongoCollection, aristaApi, interfacesCollection, workerData }) => {

    try {

        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();
        if (!interfaces || !interfaces.length) {
            logger.debug("no interfaces found in db - waiting ...");
            return;
        }

        logger.debug(`fetching poe details from ${workerData.address} ...`);

        // get poe details from device
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["enable", "configure", "show poe"],
        });

        const poePorts = result.find(r => r?.poePorts)?.poePorts;
        if (!poePorts) {
            logger.debug("no poe data returned from device");
            return;
        }

        // prepare bulk update operations
        const ops = Object.entries(poePorts).map(([ifName, port]) => ({
            updateOne: {
                filter: { interfaceId: ifName },
                update: {
                    $set: {
                        poe: {
                            present: port.portPresent,
                            enabled: port.pseEnabled,
                            state: port.portState,
                            power: port.power,
                            voltage: port.voltage,
                            current: port.current,
                            temperature: port.temperature,
                            priority: port.portPriority,
                        },
                    },
                },
                upsert: false,
            },
        }));

        if (!ops.length) {
            logger.debug("no poe updates to write");
            return;
        }

        // update db
        const bulkResult = await interfacesCollection.bulkWrite(ops);
        logger.debug(`updated db with poe details for ${bulkResult.modifiedCount} interface(s)`);

    } catch (err) {
        logger.error(`failed: ${err.message}`);
        throw err;
    }
};
