"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const appearXApi = require("@utils/appearx-api");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});
const main = async () => {

    await mongoDb.connect(workerData.id);

    const XApi = new appearXApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    await XApi.connect();

    while (true) {
        try {
            await XApi.refreshSession();

            // fetch chassis info
            const chassisInfo = await XApi.post({
                path: "mmi/api/jsonrpc",
                method: "mmi:3.6/cards/GetChassisInfo",
            });
            await mongoSingle.set("chassisInfo", chassisInfo?.data, 60);

            // fetch chassis settings
            const chassisSettings = await XApi.post({
                path: "mmi/api/jsonrpc",
                method: "mmi:3.6/chassis/GetChassisSettings",
            });
            await mongoSingle.set("chassisSettings", chassisSettings, 60);

            const ipCards = chassisInfo?.data?.cards?.filter(
                (c) => c.value.features.includes("ipinput") || c.value.features.includes("ipoutput")
            ) || [];

            let ipInterfaces = [];
            for (const eachCard of ipCards) {
                const ipInterfaceSettings = await XApi.post({
                    path: `board/ui/board/${eachCard?.value?.slot}/api/jsonrpc`,
                    method: "ipGateway:1.31/ipinterface/GetIpInterfaces",
                });
                ipInterfaces = ipInterfaces.concat(ipInterfaceSettings?.data || []);
            }
            await mongoSingle.set("ipInterfaces", ipInterfaces, 60);

        } catch (err) {
            console.error("Worker error:", err);
            await delay(5000); // wait before retry
        }

        await delay(30000);
    }
};

main();