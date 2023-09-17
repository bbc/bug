"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const Unifi = require("node-unifi");

const updateDelay = 5000;
let clientCollection;
let unifi;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password", "port"],
});

const getClients = async () => {
    if (workerData.address && workerData.username && workerData.password) {
        let clients = [];
        const loggedIn = await unifi.login(workerData.username, workerData.password);
        if (loggedIn) {
            for (let site of workerData.sites) {
                // Set Site ID
                unifi.opts.site = site;

                let clientsData = await unifi.getClientDevices();
                clientsData = clientsData.map((item) => {
                    delete item._id;
                    clients.push({ ...{ siteId: site, deviceMac: item.ap_mac, timestamp: Date.now() }, ...item });
                });
            }
            await mongoSaveArray(clientCollection, clients, "mac");
        }
    } else {
        console.log("worker-clients: Address, username or password has not been provided.");
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);
    // get the collection reference
    clientCollection = await mongoCollection("clients");
    await clientCollection.deleteMany({});

    unifi = await new Unifi.Controller({ host: workerData.address, port: workerData.port, sslverify: false });

    while (true) {
        await getClients();
        await delay(updateDelay);
    }
};

main();
