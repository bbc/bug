"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const videohub = require("@utils/videohub-promise");

const delayMs = 2000;
const errorDelayMs = 10000;
const config = workerData.config;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["address", "port"],
});

const pollDevice = async () => {
    // const Collection = await mongoCollection("interfaces");

    try {
        console.log(`videohub-worker: connecting to device at ${config.address}:${config.port}`);
        const router = new videohub({ host: config.address, port: config.port });
        router.on("update", (result) => {
            console.log("result", result);
        });
        await router.connect();
        console.log("videohub-worker: device connected ok");

        while (true) {
            console.log(".");
            await delay(20000);
        }
    } catch (error) {
        console.log("videohub-worker: failed to connect to device");
        return;
    }

    //     let noErrors = true;
    //     console.log("fetch-interfaces: starting device poll....");
    //     while (noErrors) {
    //         try {
    //             const interfaces = await mikrotikFetchInterfaces(conn);
    //             await arraySaveMongo(interfacesCollection, interfaces, "id");
    //         } catch (error) {
    //             console.log("fetch-interfaces: ", error);
    //             noErrors = false;
    //         }
    //         await delay(delayMs);
    //     }
    //     await conn.close();
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(config.id);

    // Kick things off
    while (true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log("videohub-worker: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
