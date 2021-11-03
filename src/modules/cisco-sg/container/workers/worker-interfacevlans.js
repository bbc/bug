"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const fetchInterfacevlansV1 = require("@services/fetch-interfacevlans-v1");
const fetchInterfacevlansV2 = require("@services/fetch-interfacevlans-v2");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const main = async () => {

    // stagger start of script ...
    await delay(2000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    while (true) {

        // check the control version in the system collection
        const systemCollection = await mongoCollection("system");
        const systemDocument = await systemCollection.findOne({ "type": "system" });
        if (!systemDocument || !systemDocument['control-version']) {
            console.log("worker-interfacevlans: waiting for system information ...");
            await delay(4000);
        }
        else {
            console.log(systemDocument);
            switch (systemDocument['control-version']) {
                case 1:
                    console.log("worker-interfacevlans: starting handler for control version 1");
                    await fetchInterfacevlansV1(workerData);
                    return;
                case 2:
                    console.log("worker-interfacevlans: starting handler for control version 2");
                    await fetchInterfacevlansV2(workerData);
                    return;
                default:
                    console.log("worker-interfacevlans: no control handler found");
                    return;
            }
        }
    }
}

main();
