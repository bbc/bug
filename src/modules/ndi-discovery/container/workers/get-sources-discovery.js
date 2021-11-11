"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const Net = require("net");
const parser = require("xml2json");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const fs = require("fs");

const client = new Net.Socket();
const updateDelay = 10000;
let sourceCollection;
let chunks = "";

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const getSources = async () => {
    let sources = [];

    client.connect({ port: 5959, host: workerData.address }, () => {
        console.log("TCP connection established with the server.");
        let message = Buffer.alloc(9);
        message.fill("<query/>", 0, 8);
        client.write(message);
    });

    client.on("data", async (chunk) => {
        chunks = chunks.concat(await chunk.toString());
        if (chunks.includes("<sources>") && chunks.includes("</sources>")) {
            try {
                chunks = chunks.substring(0, chunks.length - 1);
                const test = fs.writeFileSync("/home/node/module/workers/test.xml", chunks);
                const json = await parser.toJson(chunks);
                const sources = JSON.parse(json)?.sources.source;

                const collection = sources.map((item) => {
                    return { ...item, ...{ timestamp: Date.now() } };
                });

                await mongoSaveArray(sourceCollection, collection, "name");
            } catch (error) {
                console.log("get-sources-discovery: Invalid syntax of XML.");
                console.log(error);
            }
            chunks = "";
        }
    });

    client.on("end", async () => {
        console.log("Connection closed");
    });
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    sourceCollection = await mongoCollection("sources");
    sourceCollection.deleteMany({});

    while (true) {
        await getSources();
        await delay(updateDelay);
    }
};

main();
