"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ aristaApi, interfacesCollection, workerData }) => {
    try {

        // fetch switchport info from device
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show interfaces switchport"],
        });

        if (!result?.switchports) {
            logger.info("no switchport info returned from device");
            return;
        }

        const operations = [];

        for (const [interfaceId, interfaceResult] of Object.entries(result.switchports)) {
            if (!interfaceId) continue;
            // optional: filter
            // if (!interfaceId.startsWith("Ethernet")) continue;

            const info = interfaceResult?.switchportInfo;
            if (!info) continue;

            const update = {};

            if (info.accessVlanId !== undefined) {
                update.accessVlanId = info.accessVlanId;
            }
            if (info.mode !== undefined) {
                update.mode = info.mode;
            }
            if (info.trunkingNativeVlanId !== undefined) {
                update.trunkingNativeVlanId = info.trunkingNativeVlanId;
            }
            if (info.trunkAllowedVlans !== undefined) {
                update.trunkAllowedVlans = info.trunkAllowedVlans;
            }

            // skip empty updates
            if (!Object.keys(update).length) continue;

            operations.push({
                updateOne: {
                    filter: { interfaceId },
                    update: { $set: update },
                    upsert: false, // keep your original intent
                }
            });
        }

        if (operations.length) {
            const res = await interfacesCollection.bulkWrite(operations);
            logger.debug(`saved switchport info for ${res.modifiedCount} interface(s)`);
        } else {
            logger.debug("no switchport updates to apply");
        }

    } catch (err) {
        logger.error(`failed: ${err.message}`);
        throw err;
    }
};
