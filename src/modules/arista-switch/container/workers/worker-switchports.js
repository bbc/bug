"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // stagger start of script ...
    await delay(2000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-switchports: connecting to device at ${workerData.address}`);

    while (true) {
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show interfaces switchport"],
        });

        if (result?.switchports) {
            for (let [interfaceId, interfaceResult] of Object.entries(result?.switchports)) {
                const dbDocument = {
                    accessVlanId: interfaceResult?.switchportInfo?.accessVlanId,
                    mode: interfaceResult?.switchportInfo?.mode,
                    trunkingNativeVlanId: interfaceResult?.switchportInfo?.trunkingNativeVlanId,
                    trunkAllowedVlans: interfaceResult?.switchportInfo?.trunkAllowedVlans,
                };

                await interfacesCollection.updateOne(
                    { interfaceId: interfaceId },
                    { $set: dbDocument },
                    { upsert: false }
                );
            }
        }
        await delay(30000);
    }
};

main();
