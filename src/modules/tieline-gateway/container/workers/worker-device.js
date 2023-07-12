"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const tielineApi = require("@utils/tieline-api");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);

    const TielineApi = new tielineApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // Kick things off
    console.log(`worker-device: starting ...`);

    // use an infinite loop
    while (true) {
        try {
            const device = {};

            // fetch local session port
            const rtpConfig = await TielineApi.get("/api/get_config?config-param=RTP");
            device["localSessionPort"] = rtpConfig?.result?.config?.LISTEN_PORT?._text;
            device["localAltSessionPort"] = rtpConfig?.result?.config?.ALT_LISTEN_PORT?._text;

            // fetch local session port
            const systemConfig = await TielineApi.get("/api/get_config?config-param=SYSTEM");
            device["hostname"] = systemConfig?.result?.config?.HOSTNAME_STR?._text;

            // fetch QOS
            const qosConfig = await TielineApi.get("/api/get_config?config-param=QOS");
            device["dscp"] = qosConfig?.result?.config?.DSCP?._text;

            await mongoSingle.set("device", device, 240);
        } catch (error) {
            console.log(`worker-device: ${error}`);
        }

        // delay before doing it all again ...
        await delay(60000);
    }
};

main();
