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
let transmittersCollection;
let receiversCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port", "apiKey", "domain"],
});

const isArray = (a) => {
    return !!a && a.constructor === Array;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    domainsCollection = await mongoCollection("domains");
    transmittersCollection = await mongoCollection("transmitters");
    receiversCollection = await mongoCollection("receivers");

    // Kick things off
    console.log(`worker-ddm: connecting to domain manager at ${workerData.address}`);

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

        await domainsCollection.deleteMany({});
        await mongoSaveArray(domainsCollection, domainsItems, "name");

        const transmittersItems = [];

        if (isArray(response?.domains)) {
            for (let domain of response?.domains) {
                if (workerData.domain.includes(domain.name)) {
                    for (let deivce of domain?.devices) {
                        for (let txChannel of deivce?.txChannels) {
                            txChannel.timestamp = new Date();
                            txChannel.domain = domain.name;
                            txChannel.device = deivce.name;
                            transmittersItems.push(txChannel);
                        }
                    }
                }
            }
        }

        await transmittersCollection.deleteMany({});
        await mongoSaveArray(transmittersCollection, transmittersItems, "id");

        const receiversItems = [];

        if (isArray(response?.domains)) {
            for (let domain of response?.domains) {
                if (workerData.domain.includes(domain.name)) {
                    for (let deivce of domain?.devices) {
                        for (let rxChannel of deivce?.rxChannels) {
                            rxChannel.timestamp = new Date();
                            rxChannel.domain = domain.name;
                            rxChannel.device = deivce.name;
                            receiversItems.push(rxChannel);
                        }
                    }
                }
            }
        }

        await receiversCollection.deleteMany({});
        await mongoSaveArray(receiversCollection, receiversItems, "id");

        await delay(updateDelay);
    }
};

main();
