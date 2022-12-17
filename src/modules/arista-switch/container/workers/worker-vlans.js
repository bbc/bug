"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-vlans: connecting to device at ${workerData.address}`);

    while (true) {
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show vlan"],
        });

        if (result?.vlans) {
            const vlans = [];
            for (let [vlanId, eachVlan] of Object.entries(result?.vlans)) {
                vlans.push({
                    id: parseInt(vlanId),
                    name: eachVlan.name,
                    dynamic: eachVlan.dynamic,
                    status: eachVlan.status,
                });
            }
            await mongoSingle.set("vlans", vlans, 60);
        }
        await delay(20400);
    }
};

main();
