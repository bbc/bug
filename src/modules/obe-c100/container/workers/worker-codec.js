"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const snmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");
const obeOids = require("@utils/obe-oids");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity", "encoderIndex"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-codec: connecting to device at ${workerData.address}`);

    // console.log(workerData);
    while (true) {
        const results = {};

        // fetch device OIDs first
        const deviceOids = obeOids.getDevice(workerData.encoderIndex);
        const deviceSnmpResults = await snmpAwait.getMultiple({
            host: workerData.address,
            community: workerData.snmpCommunity,
            maxRepetitions: 1000,
            oids: Object.keys(deviceOids),
        });

        for (const [oid, label] of Object.entries(deviceOids)) {
            if (deviceSnmpResults[oid] !== undefined) {
                results[label] = deviceSnmpResults[oid];
            }
        }

        // then count number of audio channels
        const allAudioOids = [];
        for (let i = 0; i < 8; i++) {
            allAudioOids.push(`1.3.6.1.4.1.40562.3.2.7.1.1.2.${workerData.encoderIndex}.${i}`);
        }
        const validAudioTracks = await snmpAwait.checkExists({
            host: workerData.address,
            community: workerData.snmpCommunity,
            maxRepetitions: 1000,
            oids: allAudioOids,
        });

        results["audio"] = [];

        // and loop through the valid audio channels and fetch their SNMP data
        for (const [index, track] of validAudioTracks.entries()) {
            if (track.isValid) {
                results["audio"][index] = {};
                const audioTrackOids = obeOids.getAudio(workerData.encoderIndex, index);
                const audioSnmpResults = await snmpAwait.getMultiple({
                    host: workerData.address,
                    community: workerData.snmpCommunity,
                    maxRepetitions: 1000,
                    oids: Object.keys(audioTrackOids),
                });

                for (const [oid, label] of Object.entries(audioTrackOids)) {
                    if (audioSnmpResults[oid] !== undefined) {
                        results["audio"][index][label] = audioSnmpResults[oid];
                    }
                }
            }
        }

        // lastly, count the number of output channels
        const allOutputOids = [];
        for (let i = 0; i < 8; i++) {
            allOutputOids.push(`1.3.6.1.4.1.40562.3.2.10.1.1.2.${workerData.encoderIndex}.${i}`);
        }
        const validOutputs = await snmpAwait.checkExists({
            host: workerData.address,
            community: workerData.snmpCommunity,
            maxRepetitions: 1000,
            oids: allOutputOids,
        });

        results["outputs"] = [];

        // and loop through the valid outputs and fetch their SNMP data
        for (const [index, output] of validOutputs.entries()) {
            if (output.isValid) {
                results["outputs"][index] = {};
                const outputOids = obeOids.getOutput(workerData.encoderIndex, index);
                const outputSnmpResults = await snmpAwait.getMultiple({
                    host: workerData.address,
                    community: workerData.snmpCommunity,
                    maxRepetitions: 1000,
                    oids: Object.keys(outputOids),
                });

                for (const [oid, label] of Object.entries(outputOids)) {
                    if (outputSnmpResults[oid] !== undefined) {
                        results["outputs"][index][label] = outputSnmpResults[oid];
                    }
                }
            }
        }

        // update the db
        await mongoSingle.set("codecdata", results, 60);

        // wait 5 seconds
        await delay(5000);
    }
};

main();
