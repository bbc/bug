"use strict";

const register = require("module-alias/register");
const aristaApi = require("@utils/arista-api");
const mongoCollection = require("@core/mongo-collection");

const convertBandwidth = (bandwidth) => {
    switch (bandwidth) {
        case 10000000000:
            return "10G";
        case 1000000000:
            return "1G";
        case 100000000:
            return "100M";
        case 100000000:
            return "10M";
        default:
            return "";
    }
};

module.exports = async (config) => {

    const result = await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["show interfaces status"],
    });

    let interfaceCount = 0;

    const interfacesCollection = await mongoCollection("interfaces");

    if (result) {
        for (let [interfaceId, eachInterface] of Object.entries(result?.interfaceStatuses)) {
            if (interfaceId) {
                eachInterface.interfaceId = interfaceId;
                eachInterface.longId = interfaceId;
                eachInterface.label = interfaceId;
                eachInterface.port = 0;
                eachInterface.bandwidthText = convertBandwidth(eachInterface.bandwidth);

                if (interfaceId.indexOf("Ethernet") === 0) {
                    eachInterface.label = "eth";
                    eachInterface.port = parseInt(interfaceId.substring("Ethernet".length));
                    eachInterface.shortId = `${eachInterface.label}${eachInterface.port}`;

                    // remove the vlan information - we don't need it right now
                    delete eachInterface.vlanInformation;

                    // add the timestamp
                    const dbDocument = { ...eachInterface, timestamp: new Date() };

                    // and save it to the db
                    await interfacesCollection.updateOne(
                        { interfaceId: dbDocument.interfaceId },
                        { $set: dbDocument },
                        { upsert: true }
                    );
                    interfaceCount += 1;
                }
            }
        }
    }
    else {
        throw new Error(`Failed to connect to device`);
    }
    console.log(`arista-fetchinterfaces: updated db with details for ${interfaceCount} interface(s)`);

};
