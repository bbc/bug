"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const appearXApi = require("@utils/appearx-api");
const mongoCollection = require("@core/mongo-collection");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const XApi = new appearXApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // wait for chassis info to be populated first
    await delay(3000);

    await XApi.connect();

    while (true) {
        await XApi.refreshSession();

        // now fetch results across all IP cards
        const chassisInfo = await mongoSingle.get("chassisInfo");
        if (chassisInfo) {
            const ipCards = chassisInfo?.cards.filter(
                (c) => c.value.features.includes("ipinput") || c.value.features.includes("ipoutput")
            );

            if (ipCards) {
                // fetch input services
                let inputServicesArray = [];
                for (const eachCard of ipCards) {
                    const inputServices = await XApi.post({
                        path: `board/${eachCard?.value?.slot}/api/jsonrpc`,
                        method: "board:4.0/services/GetInputServices",
                        params: { query: { value: { servicePresence: "ALL" } } },
                    });
                    inputServicesArray = inputServicesArray.concat(inputServices?.data);
                }
                await mongoSingle.set("mpegInputServices", inputServicesArray, 60);

                // fetch output services
                let outputServicesArray = [];
                for (const eachCard of ipCards) {
                    const outputServices = await XApi.post({
                        path: `board/${eachCard?.value?.slot}/api/jsonrpc`,
                        method: "board:4.0/services/GetOutputServices",
                        params: {},
                    });
                    outputServicesArray = outputServicesArray.concat(outputServices?.data);
                }
                await mongoSingle.set("mpegOutputServices", outputServicesArray, 60);

                // fetch IP inputs
                let ipInputsArray = [];
                for (const eachCard of ipCards) {
                    const ipInputs = await XApi.post({
                        path: `board/${eachCard?.value?.slot}/api/jsonrpc`,
                        method: "ipGateway:1.31/input/GetInputs",
                    });
                    ipInputsArray = ipInputsArray.concat(
                        ipInputs?.data.map((i) => {
                            return { ...i, slot: eachCard?.value?.slot };
                        })
                    );
                }
                await mongoSingle.set("ipInputs", ipInputsArray, 60);

                // fetch IP outputs
                let ipOutputsArray = [];
                for (const eachCard of ipCards) {
                    const ipOutputs = await XApi.post({
                        path: `board/${eachCard?.value?.slot}/api/jsonrpc`,
                        method: "ipGateway:1.31/output/GetOutputs",
                    });
                    ipOutputsArray = ipOutputsArray.concat(
                        ipOutputs?.data.map((i) => {
                            return { ...i, slot: eachCard?.value?.slot };
                        })
                    );
                }
                await mongoSingle.set("mpegIpOutputs", ipOutputsArray, 60);

                // fetch inputstatus
                let ipInputStatusArray = [];
                for (const eachCard of ipCards) {
                    const ipInputStatus = await XApi.post({
                        path: `board/${eachCard?.value?.slot}/api/jsonrpc`,
                        method: "ipGateway:1.31/status/GetIpInputStatus",
                    });

                    ipInputStatusArray = ipInputStatusArray.concat(
                        ipInputStatus?.data.map((i) => {
                            return { ...i, slot: eachCard?.value?.slot };
                        })
                    );
                }
                await mongoSingle.set("ipInputStatus", ipInputStatusArray, 60);
            }
        }

        // delay before doing it all again ...
        await delay(6000);
    }
};

main();
