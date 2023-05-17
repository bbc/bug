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
    await delay(2000);

    await XApi.connect();

    // clear any localdata
    //TODO const localdataCollection = await mongoCollection("localdata");
    //TODO await localdataCollection.deleteMany({});

    while (true) {
        await XApi.refreshSession();

        // fetch audio encode profiles
        const mpegEncodeAudioProfiles = await XApi.post({
            path: "mmi/service_encoderpool/api/jsonrpc",
            method: "Xger:2.31/audioProfile/GetAudioProfiles",
        });
        await mongoSingle.set("mpegEncodeAudioProfiles", mpegEncodeAudioProfiles?.data, 60);

        // fetch video encode profiles
        const mpegEncodeVideoProfiles = await XApi.post({
            path: "mmi/service_encoderpool/api/jsonrpc",
            method: "Xger:2.31/videoProfile/GetVideoProfiles",
        });
        await mongoSingle.set("mpegEncodeVideoProfiles", mpegEncodeVideoProfiles?.data, 60);

        // fetch video encode profiles
        const mpegEncodeColorProfiles = await XApi.post({
            path: "mmi/service_encoderpool/api/jsonrpc",
            method: "Xger:2.31/colorProfile/GetColorProfiles",
        });
        await mongoSingle.set("mpegEncodeColorProfiles", mpegEncodeColorProfiles?.data, 60);

        // fetch test generator encode profiles
        const mpegEncodeVancProfiles = await XApi.post({
            path: "mmi/service_encoderpool/api/jsonrpc",
            method: "Xger:2.31/vancProfile/GetVancProfiles",
        });
        await mongoSingle.set("mpegEncodeVancProfiles", mpegEncodeVancProfiles?.data, 60);

        // fetch test generator encode profiles
        const mpegEncodeTestGeneratorProfiles = await XApi.post({
            path: "mmi/service_encoderpool/api/jsonrpc",
            method: "Xger:2.31/testGeneratorProfile/GetTestGeneratorProfiles",
        });
        await mongoSingle.set("mpegEncodeTestGeneratorProfiles", mpegEncodeTestGeneratorProfiles?.data, 60);

        // fetch encoder services
        const mpegEncoderServices = await XApi.post({
            path: "mmi/service_encoderpool/api/jsonrpc",
            method: "Xger:2.31/coderService/GetCoderServices",
        });
        await mongoSingle.set("mpegEncoderServices", mpegEncoderServices?.data, 60);

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

                // fetch outputs
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
            }
        }

        // delay before doing it all again ...
        await delay(30000);
    }
};

main();
