"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");
const mongoSingle = require("@core/mongo-single");

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

    const data = {
        fields: "id;name;status",
    };

    while (true) {
        const result = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-vlan-oper:vlans/vlan",
            data: data,
            timeout: 5000,
            username: workerData["username"],
            password: workerData["password"],
        });

        const vlans = [];

        for (const eachVlan of result?.["Cisco-IOS-XE-vlan-oper:vlan"]) {
            if (eachVlan["status"] === "active") {
                vlans.push({
                    id: eachVlan["id"],
                    label: eachVlan["name"],
                });
            }
        }

        // save vlans
        await mongoSingle.set("vlans", vlans, 60);

        // wait 4 minutes -
        await delay(40000);
    }
};

main();
