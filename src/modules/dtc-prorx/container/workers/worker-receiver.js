"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const axios = require("axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");

const updateDelay = 3000;
let receiverCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const getReceiverStatus = async () => {
    const response = await axios.get(`http://${workerData.address}:80/status.json`, { timeout: 10000 });
    if (response) {
        const entry = await receiverCollection.insertOne({
            timestamp: new Date(),
            unitName: response.data.unitName,
            snr: [
                response.data.snrA,
                response.data.snrB,
                response.data.snrC,
                response.data.snrD,
                response.data.snrE,
                response.data.snrF,
                response.data.snrG,
                response.data.snrH,
            ],
            power: [
                response.data.powerLevelA,
                response.data.powerLevelB,
                response.data.powerLevelC,
                response.data.powerLevelD,
                response.data.powerLevelE,
                response.data.powerLevelF,
                response.data.powerLevelG,
                response.data.powerLevelH,
            ],
            decoders: [
                {
                    frequency: response.data.inputFrequency1,
                    batteryVoltage: response.data.txBatteryVolts1,
                    videoLock: response.data.videoLock1,
                },
                {
                    frequency: response.data.inputFrequency2,
                    batteryVoltage: response.data.txBatteryVolts2,
                    videoLock: response.data.videoLocl2,
                },
            ],
        });
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    receiverCollection = await mongoCollection("receiver");

    while (true) {
        await getReceiverStatus();
        await delay(updateDelay);
    }
};

main();
