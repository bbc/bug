"use strict";

const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {
    try {
        // get interfaces collection
        const interfacesCollection = await mongoCollection("interfaces");

        // fetch switchport info from device
        const result = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["show interfaces switchport"],
        });

        if (!result?.switchports) {
            console.info("arista-fetchswitchports: no switchport info returned from device");
            return;
        }

        let interfaceCount = 0;

        // loop through each interface and update db
        for (const [interfaceId, interfaceResult] of Object.entries(result.switchports)) {
            const dbDocument = {
                accessVlanId: interfaceResult?.switchportInfo?.accessVlanId,
                mode: interfaceResult?.switchportInfo?.mode,
                trunkingNativeVlanId: interfaceResult?.switchportInfo?.trunkingNativeVlanId,
                trunkAllowedVlans: interfaceResult?.switchportInfo?.trunkAllowedVlans,
            };

            await interfacesCollection.updateOne(
                { interfaceId },
                { $set: dbDocument },
                { upsert: false }
            );

            interfaceCount += 1;
        }

        console.info(`arista-fetchswitchports: saved switchport info for ${interfaceCount} interface(s) to the db`);

    } catch (err) {
        console.error(`arista-fetchswitchports failed: ${err.message}`);
        throw err;
    }
};
