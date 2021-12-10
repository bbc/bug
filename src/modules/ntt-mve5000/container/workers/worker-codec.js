"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const snmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-codec: connecting to device at ${workerData.address}`);

    const oidArray = {
        "1.3.6.1.4.1.3930.36.1.1.1.0": "SysDescr",
        "1.3.6.1.4.1.3930.36.2.2.3.0": "InputSignal",
        "1.3.6.1.4.1.3930.36.2.2.21.1.0": "OutputStream1IpRate",
        "1.3.6.1.4.1.3930.36.2.2.22.1.0": "OutputStream2IpRate",

        "1.3.6.1.4.1.3930.36.3.1.1.0": "InputInterfaceVideo",
        "1.3.6.1.4.1.3930.36.3.1.2.0": "InputInterfaceAudio",
        "1.3.6.1.4.1.3930.36.2.2.2.0": "InputVideoFormat",
        "1.3.6.1.4.1.3930.36.3.1.100.2.0": "InputVideoSignalUndetected",

        "1.3.6.1.4.1.3930.36.3.1.11.0": "InputTestSignalVideo",
        "1.3.6.1.4.1.3930.36.3.1.12.0": "InputTestSignalAudio",
        "1.3.6.1.4.1.3930.36.3.1.21.0": "InputSuperimposeTextDisplay",
        "1.3.6.1.4.1.3930.36.3.1.22.0": "InputSuperimposeUpperText",
        "1.3.6.1.4.1.3930.36.3.1.23.0": "InputSuperimposeLowerText",
        "1.3.6.1.4.1.3930.36.3.1.100.11.0": "InputSuperimposeFontSize",
        "1.3.6.1.4.1.3930.36.3.1.100.12.0": "InputSuperimposeEffect",

        "1.3.6.1.4.1.3930.36.3.2.1.0": "EncLatencyMode",
        "1.3.6.1.4.1.3930.36.3.2.2.0": "EncTsRate",
        "1.3.6.1.4.1.3930.36.3.2.11.1.0": "EncVideoFormat",
        "1.3.6.1.4.1.3930.36.3.2.11.2.0": "EncVideoRate",
        "1.3.6.1.4.1.3930.36.3.2.100.1.1.0": "EncVideoProfileLevel",

        "1.3.6.1.4.1.3930.36.3.2.12.1.0": "audio_0_EncAudioFormat",
        "1.3.6.1.4.1.3930.36.3.2.12.3.0": "audio_0_EncAudioRate2Ch",
        "1.3.6.1.4.1.3930.36.3.2.13.1.0": "audio_1_EncAudioFormat",
        "1.3.6.1.4.1.3930.36.3.2.13.3.0": "audio_1_EncAudioRate2Ch",

        // stream 1
        "1.3.6.1.4.1.3930.36.3.5.1.0": "outputs_0_StreamTransmission",
        "1.3.6.1.4.1.3930.36.3.5.3.0": "outputs_0_StreamProtocol",
        "1.3.6.1.4.1.3930.36.3.5.11.2.0": "outputs_0_StreamIpv4DstAddress",
        "1.3.6.1.4.1.3930.36.3.5.4.0": "outputs_0_StreamPortNumber",
        "1.3.6.1.4.1.3930.36.3.5.5.0": "outputs_0_StreamTransmitInterface",
        "1.3.6.1.4.1.3930.36.3.5.100.1.11.0": "outputs_0_StreamOutputIpv4Tos",
        "1.3.6.1.4.1.3930.36.3.5.100.1.12.0": "outputs_0_StreamOutputIpv4Ttl",

        "1.3.6.1.4.1.3930.36.3.5.21.0": "outputs_0_StreamErrorCorrectionMode",
        "1.3.6.1.4.1.3930.36.3.5.100.2.1.0": "outputs_0_StreamErrFecDimension",
        "1.3.6.1.4.1.3930.36.3.5.100.2.2.0": "outputs_0_StreamErrFecColumnNumber",
        "1.3.6.1.4.1.3930.36.3.5.100.2.3.0": "outputs_0_StreamErrFecRowNumber",
        "1.3.6.1.4.1.3930.36.3.5.100.2.32.0": "outputs_0_Stream1ErrArqPortNumber",

        // stream 2
        "1.3.6.1.4.1.3930.36.3.6.1.0": "outputs_1_StreamTransmission",
        "1.3.6.1.4.1.3930.36.3.6.3.0": "outputs_1_StreamProtocol",
        "1.3.6.1.4.1.3930.36.3.6.4.0": "outputs_1_StreamPortNumber",
        "1.3.6.1.4.1.3930.36.3.6.100.1.12.0": "outputs_1_StreamOutputIpv4Ttl",
        "1.3.6.1.4.1.3930.36.3.6.5.0": "outputs_1_StreamTransmitInterface",
        "1.3.6.1.4.1.3930.36.3.6.11.2.0": "outputs_1_StreamIpv4DstAddress",
        "1.3.6.1.4.1.3930.36.3.6.100.1.11.0": "outputs_1_StreamOutputIpv4Tos",

        "1.3.6.1.4.1.3930.36.3.6.21.0": "outputs_1_StreamErrorCorrectionMode",
        "1.3.6.1.4.1.3930.36.3.6.100.2.1.0": "outputs_1_StreamErrFecDimension",
        "1.3.6.1.4.1.3930.36.3.6.100.2.2.0": "outputs_1_StreamErrFecColumnNumber",
        "1.3.6.1.4.1.3930.36.3.6.100.2.3.0": "outputs_1_StreamErrFecRowNumber",
        "1.3.6.1.4.1.3930.36.3.6.100.2.32.0": "outputs_1_StreamErrArqPortNumber",
    };

    while (true) {
        const snmpResults = await snmpAwait.getMultiple({
            host: workerData.address,
            community: workerData.snmpCommunity,
            maxRepetitions: 1000,
            oids: Object.keys(oidArray),
        });

        const results = {};

        for (const [oid, label] of Object.entries(oidArray)) {
            if (snmpResults[oid] !== undefined) {
                results[label] = snmpResults[oid];
            }
        }

        // update the db
        await mongoSingle.set("codecdata", results, 60);

        // wait 5 seconds
        await delay(5000);
    }
};

main();
