"use strict";

const register = require("module-alias/register");
const aristaApi = require("@utils/arista-api");
const mongoCollection = require("@core/mongo-collection");

const convertBandwidth = (bandwidth) => {
    switch (bandwidth) {
        case 10000000000: return "10G";
        case 1000000000: return "1G";
        case 100000000: return "100M";
        case 10000000: return "10M";
        default: return "";
    }
};

module.exports = async (config) => {
    let interfacesCollection;

    try {
        // get interfaces collection
        interfacesCollection = await mongoCollection("interfaces");

        // fetch interface status from device
        const result = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["show interfaces status"],
        });

        let interfaceCount = 0;

        // iterate over interfaces returned by device
        for (const [interfaceId, eachInterface] of Object.entries(result.interfaceStatuses)) {
            if (!interfaceId) continue;

            eachInterface.interfaceId = interfaceId;
            eachInterface.longId = interfaceId;
            eachInterface.label = interfaceId;
            eachInterface.port = 0;
            eachInterface.bandwidthText = convertBandwidth(eachInterface.bandwidth);

            if (interfaceId.startsWith("Ethernet")) {
                eachInterface.label = "eth";
                eachInterface.port = parseInt(interfaceId.substring("Ethernet".length), 10);
                eachInterface.shortId = `${eachInterface.label}${eachInterface.port}`;

                // remove vlan info, not needed right now
                delete eachInterface.vlanInformation;

                // add timestamp
                const dbDocument = { ...eachInterface, timestamp: new Date() };

                // save to db
                await interfacesCollection.updateOne(
                    { interfaceId: dbDocument.interfaceId },
                    { $set: dbDocument },
                    { upsert: true }
                );

                interfaceCount += 1;
            }
        }

        console.log(`arista-fetchinterfaces: updated db with details for ${interfaceCount} interface(s)`);

    } catch (err) {
        console.error(`arista-fetchinterfaces failed: ${err.message}`);
        throw err;
    }
};
