"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const axios = require("axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const parser = require("xml-js");

const updateDelay = 3000;
let receiverCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const getReceiverStatus = async () => {
    const response = await axios.get(`http://${workerData.address}:80/data.xml`, { timeout: 10000 });
    if (response.data) {
        const dataString = parser.xml2json(response.data, { compact: true, trim: true, spaces: 4 });
        const data = JSON.parse(dataString);
        const power = [];
        const snr = [];
        let packetErrors = null;
        let frequency = null;
        let videoLock = false;

        for (let parameter of data.data.parameter) {
            if (parameter.name._text.includes("DB_DEMOD_PWR_LEVEL_")) {
                power.push(parameter.value?._cdata);
            }
            if (parameter.name._text.includes("DB_DEMOD_MER_")) {
                snr.push(parameter.value?._cdata);
            }
            if (parameter.name._text.includes("DB_DEMOD_PKT_ERR_RATE")) {
                packetErrors = parseFloat(parameter.value?._cdata);
            }
            if (parameter.name._text.includes("DB_L2174_FREQ1")) {
                frequency = parseFloat(parameter.value?._cdata) * 1000;
            }
            if (parameter.name._text.includes("DB_DECOD_VIDEO_LOCKED")) {
                if (parameter.value?._cdata.includes("No Lock")) {
                    videoLock = false;
                } else {
                    videoLock = true;
                }
            }
        }

        const entry = await receiverCollection.insertOne({
            timestamp: new Date(),
            unitName: response.data.unitName,
            snr: snr,
            power: power,
            decoders: [{ packetErrors: packetErrors, frequency: frequency, videoLock: videoLock }],
        });
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    receiverCollection = await mongoCollection("receiver");

    while (true) {
        if (workerData.address) {
            await getReceiverStatus();
        } else {
            console.log("No reciever IP address provided");
        }
        await delay(updateDelay);
    }
};

main();
