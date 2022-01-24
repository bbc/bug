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

const isArray = (a) => {
    return !!a && a.constructor === Array;
};

const getSources = async () => {
    let sources = [];

    client.connect({ port: 5959, host: workerData.address }, () => {
        console.log(`worker-sourcesdiscovery: Connection established with the ${workerData.address}.`);
        let message = Buffer.alloc(9);
        message.fill("<query/>", 0, 8);
        client.write(message);
    });

    client.on("data", async (chunk) => {
        chunks = chunks.concat(await chunk.toString());
        if (chunks.includes("<sources>") && chunks.includes("</sources>")) {
            try {
                chunks = chunks.substring(0, chunks.length - 1);
                const json = await parser.toJson(chunks);
                const sources = JSON.parse(json)?.sources.source;

                const collection = sources.map((item) => {
                    let groups = [];

                    if (item?.groups?.group) {
                        if (isArray(item.groups.group)) {
                            for (let group of item?.groups?.group) {
                                groups.push(group);
                            }
                        } else {
                            groups.push(item.groups.group);
                        }
                        groups.sort();
                    }

                    return {
                        timestamp: Date.now(),
                        address: item.address,
                        port: item.port,
                        device: item.name.split(" (")[0],
                        source: item.name.split(" (")[1].replace(")", ""),
                        groups: groups,
                    };
                });

                await mongoSaveArray(sourceCollection, collection, "source");
                await client.end();
            } catch (error) {
                console.log("worker-sourcesdiscovery: Invalid syntax of XML.");
                console.log(error);
            }
            chunks = "";
        }
    });

    client.on("end", async () => {
        console.log("worker-sourcesdiscovery: Connection closed");
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
