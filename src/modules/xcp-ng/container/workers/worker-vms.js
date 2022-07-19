"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const { createClient } = require("xen-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 2000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-vms: connecting to host ...`);

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
            xapi.call("VM.get_all_records")
                .then(async function (vmsFromApi) {
                    const vms = [];

                    if (vmsFromApi) {
                        for (const [eachIndex, eachValue] of Object.entries(vmsFromApi)) {
                            if (!eachValue.is_a_template && !eachValue.is_a_snapshot && !eachValue.is_control_domain) {
                                vms.push({
                                    ref: eachIndex,
                                    uuid: eachValue.uuid,
                                    allowed_operations: eachValue.allowed_operations,
                                    current_operations: eachValue.current_operations,
                                    power_state: eachValue.power_state,
                                    name_label: eachValue.name_label,
                                    name_description: eachValue.name_description,
                                    VCPUs_max: eachValue.VCPUs_max,
                                    memory_target: eachValue.memory_target,
                                    tags: eachValue.tags,
                                    other_config: eachValue.other_config,
                                    resident_on: eachValue.resident_on,
                                    guest_metrics: eachValue.guest_metrics,
                                });
                            }
                        }
                    }

                    // use mongoDb or mongoSingle to save to DB
                    await mongoSingle.set("vms", vms, 120);
                })
                .catch(function (error) {
                    console.error(error);
                });
        });

        // delay before doing it all again ...
        await delay(2000);
    }
};

main();
