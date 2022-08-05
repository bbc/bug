"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const Unifi = require("node-unifi");

const updateDelay = 5000;
let deviceCollection;
let clientsCollection;
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

                siteDevices = siteDevices.map(async (item) => {
                    let connected = false;
                    if (Date.now() / 1000 - item.last_seen < item.next_interval) {
                        connected = true;
                    }

                    //Calculate the number of clients connected to the device
                    const clients = await clientsCollection.find({ deviceMac: item.mac }).toArray();
                    item.clientCount = clients.length;

                    delete item.next_interval;
                    delete item.last_seen;
                    delete item.device_id;

                    devices.push({
                        ...{ deviceId: item._id, siteId: site, connected: connected, timestamp: Date.now() },
                        ...item,
                    });
                });
            }
            await mongoSaveArray(deviceCollection, devices, "mac");
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
    clientsCollection = await mongoCollection("clients");
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
