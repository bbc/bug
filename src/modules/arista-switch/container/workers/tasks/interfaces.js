"use strict";

const logger = require("@core/logger")(module);

const convertBandwidth = (bandwidth) => {
    switch (bandwidth) {
        case 10000000000: return "10G";
        case 1000000000: return "1G";
        case 100000000: return "100M";
        case 10000000: return "10M";
        default: return `${bandwidth || ""}`;
    }
};

module.exports = async ({ aristaApi, interfacesCollection, workerData }) => {
    try {
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show interfaces status"],
        });

        if (!result?.interfaceStatuses) {
            throw new Error("Invalid response from aristaApi");
        }

        const operations = [];

        for (const [interfaceId, eachInterface] of Object.entries(result.interfaceStatuses)) {
            if (!interfaceId || !interfaceId.startsWith("Ethernet")) continue;

            const match = interfaceId.match(/^Ethernet(\d+)/);
            if (!match) continue;

            const port = parseInt(match[1], 10);

            const doc = {
                ...eachInterface,
                interfaceId,
                longId: interfaceId,
                label: "eth",
                port,
                shortId: `eth${port}`,
                bandwidthText: convertBandwidth(eachInterface.bandwidth),
                timestamp: new Date(),
            };

            delete doc.vlanInformation;

            operations.push({
                updateOne: {
                    filter: { interfaceId },
                    update: { $set: doc },
                    upsert: true,
                }
            });
        }

        if (operations.length) {
            await interfacesCollection.bulkWrite(operations);
        }

        logger.info(`updated db with details for ${operations.length} interface(s)`);

    } catch (error) {
        logger.error(error.message);
        throw error;
    }
};