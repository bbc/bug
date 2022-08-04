"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const Unifi = require("node-unifi");

const updateDelay = 10000;
let deviceCollection;
let unifi;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["sites"],
});

const getDevices = async () => {
    if (workerData.address && workerData.username && workerData.password) {
        let devices = [];

        const loggedIn = await unifi.login(workerData.username, workerData.password);

        if (loggedIn) {
            for (let site of workerData.sites) {
                // GET SITE STATS
                unifi.opts.site = site;
                let siteDevices = await unifi.getAccessDevices();

                siteDevices = siteDevices.map((item) => {
                    return { ...{ siteId: site }, ...item };
                });
                devices = devices.concat(devices, siteDevices);
            }
            await mongoSaveArray(deviceCollection, devices, "_id");
        }
    } else {
        console.log("worker-devices: Address, username or password has not been provided.");
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);
    // get the collection reference
    deviceCollection = await mongoCollection("devices");
    deviceCollection.deleteMany({});

    unifi = await new Unifi.Controller({
        host: workerData.address,
        port: workerData.port,
        sslverify: false,
    });

    while (true) {
        await getDevices();
        await delay(updateDelay);
    }
};

main();
