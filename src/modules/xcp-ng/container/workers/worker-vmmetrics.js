"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const axios = require("axios");
const { createClient } = require("xen-api");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 2000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-vmmetrics: connecting to host ...`);

    const xapi = await createClient({
        url: `https://${workerData.address}`,
        allowUnauthorized: true,
        auth: {
            user: workerData.username,
            password: workerData.password,
        },
        readOnly: true,
    });

    // use an infinite loop
    while (true) {
        xapi.connect()
            .then(() => {
                xapi.call("VM_guest_metrics.get_all_records").then(async function (vmMetricsFromApi) {
                    const vmMetrics = [];

                    if (vmMetricsFromApi) {
                        for (const [eachIndex, eachValue] of Object.entries(vmMetricsFromApi)) {
                            vmMetrics.push({
                                ref: eachIndex,
                                uuid: eachValue.uuid,
                                os_version: eachValue.os_version,
                                other: eachValue.other,
                                last_updated: eachValue.last_updated,
                                live: eachValue.live,
                                networks: eachValue.networks,
                                PV_drivers_version: eachValue.PV_drivers_version,
                            });
                        }
                    }

                    // use mongoDb or mongoSingle to save to DB
                    await mongoSingle.set("vmmetrics", vmMetrics, 240);
                });
            })
            .catch(function (error) {
                console.error(error);
            });

        // delay before doing it all again ...
        await delay(10000);
    }
};

main();
