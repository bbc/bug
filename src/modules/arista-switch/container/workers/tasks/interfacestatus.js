"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ aristaApi, workerData, mongoSingle }) => {
    try {
        const interfaceStatuses = [];

        // fetch list of interfaces which are error-disabled
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show interfaces status errdisabled"],
        });

        if (!result?.interfaceStatuses) {
            logger.info("no errdisabled interfaces returned from device");
            await mongoSingle.set("interfacestatuses", [], 60);
            return;
        }

        // iterate over each interface returned by device
        for (const [interfaceId, eachInterface] of Object.entries(result.interfaceStatuses)) {
            const causes = Array.isArray(eachInterface.causes) && eachInterface.causes.length
                ? eachInterface.causes.join(", ")
                : "an unknown cause";

            interfaceStatuses.push({
                key: `intStatus${interfaceId}`,
                message: `${interfaceId} is in an error-disabled state due to ${causes}`,
                type: "warning",
                flags: [],
            });
        }

        logger.info(`found ${interfaceStatuses.length} interface(s) in errdisabled state`);

        // save to mongo with 60s expiry
        await mongoSingle.set("interfacestatuses", interfaceStatuses, 60);

    } catch (err) {
        logger.error(`arista-fetchinterfacestatus failed: ${err.message}`);
        throw err;
    }
};
