"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");
const deviceSetPending = require("@services/device-setpending");

module.exports = async (interfaceId, action) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        if (!["enable", "disable"].includes(action)) {
            throw new Error(`invalid action '${action}', must be 'enable' or 'disable'`);
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const actionText = action === "enable" ? "enabling" : "disabling";
        console.log(`interface-poe: ${actionText} POE on interface ${interfaceId} ...`);

        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: [
                "enable",
                "configure",
                `interface ${interfaceId}`,
                action === "enable" ? "no poe disabled" : "poe disabled",
            ],
        });

        console.log(`interface-poe: success - updating DB`);

        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId },
            { $set: { "poe.enabled": action === "enable" } }
        );

        console.log(`interface-poe: ${JSON.stringify(dbResult.result)}`);

        if (dbResult.matchedCount !== 1) {
            throw new Error(`expected to update 1 interface in DB, matched ${dbResult.matchedCount}`);
        }
        await deviceSetPending(false);
        return true;

    } catch (err) {
        err.message = `interface-poe(${interfaceId}, ${action}): ${err.stack || err.message || err}`;
        throw err;
    }
};
