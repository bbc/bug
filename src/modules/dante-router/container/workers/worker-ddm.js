"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoSaveArray = require("@core/mongo-savearray");
const ddm = require("@services/ddm-request");

const updateDelay = 3000;
let domainsCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port", "apiKey"],
});

const isArray = (a) => {
    return !!a && a.constructor === Array;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    domainsCollection = await mongoCollection("domains");

    // Kick things off
    console.log(`worker-ddm: connecting to domain manger at ${workerData.address}:${workerData.port}`);

    while (true) {
        // poll occasionally
        const response = await ddm.get(
            workerData.address,
            workerData.port,
            workerData.apiKey,
            ddm.query`
            query Devices {
                domains {
                  name
                  devices {
                    id
                    name
                    status {
                      connectivity
                      subscriptions
                    }
                    rxChannels {
                      id
                      index
                      name
                      subscribedDevice
                      subscribedChannel
                      status
                    }
                    txChannels {
                        id
                        index
                        name
                    }
                  }
                  status {
                    clocking
                    connectivity
                    latency
                    subscriptions
                    summary
                  }
                }
              }
            `
        );

        const domainsItems = [];

        if (isArray(response?.domains)) {
            for (let item of response?.domains) {
                item.timestamp = new Date();
                domainsItems.push(item);
            }
        }

        domainsCollection.deleteMany({});
        await mongoSaveArray(domainsCollection, response?.domains, "name");

        await delay(updateDelay);
    }
};

main();
