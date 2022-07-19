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
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-hosts: connecting to host ...`);

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
        xapi.connect().then(() => {
            xapi.call("host.get_all_records")
                .then(async function (hostsFromApi) {
                    const hosts = [];

                    if (hostsFromApi) {
                        for (const [eachIndex, eachValue] of Object.entries(hostsFromApi)) {
                            hosts.push({
                                ref: eachIndex,
                                uuid: eachValue.uuid,
                                allowed_operations: eachValue.allowed_operations,
                                current_operations: eachValue.current_operations,
                                name_label: eachValue.name_label,
                                name_description: eachValue.name_description,
                                enabled: eachValue.enabled,
                                software_version: eachValue.software_version,
                                cpu_info: eachValue.cpu_info,
                                hostname: eachValue.hostname,
                                address: eachValue.address,
                            });
                        }
                    }

                    // use mongoDb or mongoSingle to save to DB
                    await mongoSingle.set("hosts", hosts, 240);
                })
                .catch(function (error) {
                    console.error(error);
                });
        });

        // delay before doing it all again ...
        await delay(10000);
    }
};

main();
