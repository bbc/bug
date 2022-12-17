"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const Unifi = require("node-unifi");

const updateDelay = 60000;
let siteCollection;
let unifi;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password", "port"],
});

const getSites = async () => {
    if (workerData.address && workerData.username && workerData.password) {
        let sites = [];

        const loggedIn = await unifi.login(workerData.username, workerData.password);

        if (loggedIn) {
            const sitesData = await unifi.getSitesStats();
            sites = sitesData.map((item) => {
                return { label: item?.desc, id: item?.name, timestamp: Date.now() };
            });
            await mongoSaveArray(siteCollection, sites, "id");
        }
    } else {
        console.log("worker-sites: Address, username or password has not been provided.");
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);
    // get the collection reference
    siteCollection = await mongoCollection("sites");
    siteCollection.deleteMany({});

    unifi = await new Unifi.Controller({ host: workerData.address, port: workerData.port, sslverify: false });

    while (true) {
        await getSites();
        await delay(updateDelay);
    }
};

main();
