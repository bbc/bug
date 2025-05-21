"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const ultrixPromise = require("@utils/ultrix-promise");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

let dataCollection;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "dashboardPort"],
});

const main = async () => {

    await delay(99999);

    // connect to the db
    // await mongoDb.connect(workerData.id);

    // // get the collection reference
    // dataCollection = await mongoCollection("data");

    // // and now create the index with ttl
    // await mongoCreateIndex(dataCollection, "timestamp", { expireAfterSeconds: 60 });

    // // remove previous values
    // //TODO dataCollection.deleteMany({});
    // // await delay(999999);
    // const ultrix = new ultrixPromise({
    //     host: workerData.address,
    //     port: 5254,
    // });

    // await ultrix.connect();
    // ultrix.on("update", async (data) => {
    //     // process the data
    //     console.log(`Received data: ${data?.slot}:${data?.payload?.oid}=${data?.payload?.value}`);

    //     await dataCollection.replaceOne({
    //         oid: data.payload.oid
    //     }, data.payload, { upsert: true });

    //         const handshake =  {
    //           "type": "handshake",
    // "slot": slotID,
    // "payload" : {
    // "trusted" : true,
    // "password" : "device password",
    // "force" : force connection flag,
    // "detail" : “level of detail supported for device updates”, "build" : "major.minor.micro YYYY-MM-DD HH:MM"
    // }
    // });
    // ultrix.send({ "payload": { "protocol": "1.0", "subscriptions": true, "trusted": false, "build": "Version 9.14.0 2025-03-17 T10:02", "force": false, "detail": "full" }, "slot": 0, "type": "handshake" }, true);
    // await delay(1000);
    // ultrix.send({ "payload": { "detail": "full" }, "slot": 0, "type": "device-request" }, true);
    // await delay(1000);
    // ultrix.send({ "payload": { "subscribe": ["params.destio", "params.levels"], "unsubscribe": [] }, "exe-id": "1747835967585:78", "slot": 0, "type": "update-subscriptions" }, true);
    // await delay(20000);
};

main();