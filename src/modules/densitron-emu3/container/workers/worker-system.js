"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const SnmpAwait = require("@core/snmp-await");
const emu3Oids = require("@utils/emu3-oids");
const mongoSingle = require("@core/mongo-single");

const updateDelay = 5000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

// create new snmp session
const snmpAwait = new SnmpAwait({
    host: workerData.address,
    community: workerData.snmpCommunity,
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-system: connecting to device at ${workerData.address}`);

    while (true) {
        const results = {};

        // fetch system OIDs first
        const systemOids = emu3Oids.getSystem();
        const systemSnmpResults = await snmpAwait.getMultiple({
            maxRepetitions: 1000,
            oids: Object.keys(systemOids),
        });

        for (const [oid, label] of Object.entries(systemOids)) {
            if (systemSnmpResults[oid] !== undefined) {
                results[label] = systemSnmpResults[oid];
            }
        }

        results["devices"] = [];

        // you can have up to 4 devices in a stack, so we'll check each one in turn
        for (let deviceIndex = 1; deviceIndex <= 4; deviceIndex++) {
            // check if device exists
            const deviceExists = await snmpAwait.get({
                oid: `1.3.6.1.4.1.34946.5.3.${deviceIndex}.1.1.0`,
                ignoreMissing: true,
            });

            // initialise array
            const deviceArray = {
                deviceIndex: deviceIndex,
                deviceEnabled: deviceExists,
                outputs: [],
                meters: [],
            };

            if (deviceExists) {
                // get list of oids
                const deviceOids = emu3Oids.getDevice(deviceIndex);

                // fetch device OIDs
                const deviceSnmpResults = await snmpAwait.getMultiple({
                    maxRepetitions: 1000,
                    oids: Object.keys(deviceOids),
                });

                for (const [oid, label] of Object.entries(deviceOids)) {
                    if (deviceSnmpResults[oid] !== undefined) {
                        deviceArray[label] = deviceSnmpResults[oid];
                    }
                }

                // get outputs (max of 24)
                for (let outputIndex = 1; outputIndex <= 24; outputIndex++) {
                    const outputArray = {
                        outputIndex: outputIndex,
                    };

                    // get list of oids
                    const outputOids = emu3Oids.getOutput(deviceIndex, outputIndex);

                    // fetch device OIDs
                    const outputSnmpResults = await snmpAwait.getMultiple({
                        maxRepetitions: 1000,
                        oids: Object.keys(outputOids),
                        ignoreMissing: true,
                    });

                    for (const [oid, label] of Object.entries(outputOids)) {
                        if (outputSnmpResults[oid] !== undefined) {
                            outputArray[label] = outputSnmpResults[oid];
                        }
                    }

                    if (outputArray?.outputState === null) {
                        // we've reached the end of the outputs - no more to check
                        break;
                    }

                    deviceArray["outputs"].push(outputArray);
                }

                // get meters (max of 26)
                for (let meterIndex = 1; meterIndex <= 24; meterIndex++) {
                    const meterArray = {
                        meterIndex: meterIndex,
                    };

                    // get list of oids
                    const meterOids = emu3Oids.getMeter(deviceIndex, meterIndex);

                    // fetch meter OIDs
                    const meterSnmpResults = await snmpAwait.getMultiple({
                        maxRepetitions: 1000,
                        oids: Object.keys(meterOids),
                        ignoreMissing: true,
                    });

                    for (const [oid, label] of Object.entries(meterOids)) {
                        if (meterSnmpResults[oid] !== undefined) {
                            meterArray[label] = meterSnmpResults[oid];
                        }
                    }

                    if (meterArray?.meterName === null) {
                        // we've reached the end of the meters - no more to check
                        break;
                    }

                    deviceArray["meters"].push(meterArray);
                }
            }

            results["devices"].push(deviceArray);
        }

        // update the db
        await mongoSingle.set("system", results, 60);

        // wait 5 seconds
        await delay(updateDelay);
    }
};

main();
