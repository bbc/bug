"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const aristaApi = require("@utils/arista-api");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // stagger start of script ...
    await delay(4000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-interfacestatus: connecting to device at ${workerData.address}`);

    while (true) {
        const interfaceStatuses = [];

        // fetch list of interfaces which are error-disabled
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show interfaces status errdisabled"],
        });

        if (result) {
            for (let [interfaceId, eachInterface] of Object.entries(result?.interfaceStatuses)) {
                interfaceStatuses.push({
                    key: `intStatus${interfaceId}`,
                    message: `${interfaceId} is in an error-disabled state due to ${eachInterface.causes.join(", ")}`,
                    type: "warning",
                    flags: [],
                });
            }
        }

        await mongoSingle.set("interfacestatuses", interfaceStatuses, 60);

        // every 10 seconds
        await delay(10000);
    }
};

main();
