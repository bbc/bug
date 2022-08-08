"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const Magewell = require("@utils/magewell");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 3000;
let networkCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["devices"],
});

const getNetworkInfo = async () => {
    if (workerData.devices) {
        for (let deviceId in workerData.devices) {
            const magewell = await new Magewell(
                workerData.devices[deviceId].address,
                workerData.devices[deviceId].username,
                workerData.devices[deviceId].password
            );

            const networkData = await magewell.getNetwork();
            let history = {};

            if (networkData) {
                history = {
                    timestamp: new Date(),
                    tx: networkData["tx-speed-kbps"] * 1000,
                    rx: networkData["rx-speed-kbps"] * 1000,
                };

                networkData.timestamp = new Date();
                delete networkData["tx-speed-kbps"];
                delete networkData["rx-speed-kbps"];
            }

            const entry = await networkCollection.updateOne(
                { deviceId: deviceId },
                {
                    $set: {
                        deviceId: deviceId,
                        timestamp: new Date(),
                        ...networkData,
                    },
                    $push: {
                        history: {
                            $each: [{ ...history }],
                            $slice: -3000,
                        },
                    },
                },
                { upsert: true }
            );
        }
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    networkCollection = await mongoCollection("network");
    networkCollection.deleteMany({});

    // and now create the index with ttl
    await mongoCreateIndex(networkCollection, "timestamp", { expireAfterSeconds: updateDelay * 4 });

    while (true) {
        await getNetworkInfo();
        await delay(updateDelay);
    }
};

main();
