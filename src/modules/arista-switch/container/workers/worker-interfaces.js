"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const aristaApi = require("@utils/arista-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

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

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // and now create the index with ttl
    await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 900 });

    // remove previous values
    interfacesCollection.deleteMany({});

    // Kick things off
    console.log(`worker-interfaces: connecting to device at ${workerData.address}`);

    while (true) {
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show interfaces status"],
        });

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
                    }
                }
            }
        }

        // every 5 seconds
        await delay(5000);
    }
};

main();
