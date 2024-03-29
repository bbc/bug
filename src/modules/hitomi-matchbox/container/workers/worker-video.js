"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const hitomiParseValues = require("@utils/hitomi-parsevalues");
const hitomiParseList = require("@utils/hitomi-parselist");
const hitomiApi = require("@utils/hitomi-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

let apiMenu = "video1";

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    await mongoSingle.clear("video");
    await mongoSingle.clear("logoList");

    // Kick things off
    console.log(`worker-video: connecting to device ...`);

    while (true) {
        let result = await hitomiApi.get({
            host: workerData.address,
            apiFunction: "updateStatus",
            apiMenu: apiMenu,
        });
        if (!result && apiMenu === "video1") {
            apiMenu = "video";
            result = await hitomiApi.get({
                host: workerData.address,
                apiFunction: "updateStatus",
                apiMenu: apiMenu,
            });
        }
        if (result) {
            const values = hitomiParseValues(result);
            await mongoSingle.set("video", values, 60);

            const logoValues = hitomiParseList(result, "logoList");
            await mongoSingle.set("logoList", logoValues, 60);
        }

        // delay before doing it all again ...
        await delay(5000);
    }
};

main();
