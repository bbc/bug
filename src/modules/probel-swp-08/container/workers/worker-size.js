"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const Probel = require("probel-swp-08");
const mongoSingle = require("@core/mongo-single");

const updateDelay = 2000;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port", "extended"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-matrix: connecting to device at ${workerData.address}:${workerData.port}`);

    let router;
    // start checking it every 500ms
    let backoffDelay = 500;

    // sadly there's no easy way to get the size of the matrix, unless we just wait to see if the value doesn't change
    try {
        router = new Probel(workerData.address, {
            port: workerData?.port,
            extended: workerData?.extended,
            levels: workerData?.levels,
            chars: parseInt(workerData?.chars),
        });

        let previousSize = {};
        let countCheck = 0;

        while (true) {
            const size = await router.getSize();
            if (previousSize?.source === size.source && previousSize?.destinations === size.destinations) {
                countCheck += 1;
            } else {
                countCheck = 0;
            }
            previousSize = { ...size };

            // if it's been the same the last 5 times we can slow down
            if (countCheck > 5) {
                backoffDelay = 30000;

                // and update the db
                await mongoSingle.set("matrixSize", size, 60);
            }

            await delay(backoffDelay);
        }
    } catch (error) {
        throw error;
    }
};

main();
