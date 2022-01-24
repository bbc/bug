"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const { parse } = require("rss-to-json");

const updateDelay = 120000;
let feedCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const isArray = (a) => {
    return !!a && a.constructor === Array;
};

const getFeed = async () => {
    let feedItems = [];
    const feed = await parse(workerData.address);
    if (isArray(feed?.items)) {
        for (let item of feed.items) {
            feedItems.push(item);
        }
    }
    await mongoSaveArray(feedCollection, feedItems, "title");
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    feedCollection = await mongoCollection("feed");
    feedCollection.deleteMany({});

    while (true) {
        await getFeed();
        await delay(updateDelay);
    }
};

main();
