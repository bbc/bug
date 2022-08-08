"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const Magewell = require("@utils/magewell");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 3000;
let devicesCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["devices"],
});

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

const getDeviceInfo = async () => {
    if (workerData.devices) {
        for (let deviceId in workerData.devices) {
            const magewell = await new Magewell(
                workerData.devices[deviceId].address,
                workerData.devices[deviceId].username,
                workerData.devices[deviceId].password
            );

            let deviceData = await magewell.getSummary();
            const ndiConfig = await magewell.getNDIConfig();
            const history = { timestamp: new Date() };

            if (!isEmpty(deviceData)) {
                deviceData.ndi = { ...deviceData.ndi, ...ndiConfig };
                deviceData.online = true;
                deviceData = { ...deviceData, ...deviceData?.device };
                deviceData.portSpeed = deviceData?.ethernet?.state;
                deviceData.serial = deviceData["serial-no"];
                deviceData.uptime = deviceData["up-time"];
                deviceData.input = deviceData["input-state"];
                deviceData.firmwareVersion = deviceData["fw-version"];
                deviceData.address = workerData.devices[deviceId].address;
                deviceData.ndi.discoveryServer = deviceData.ndi["discovery-server"];
                deviceData.ndi.groupName = deviceData.ndi["group-name"];

                history.temperature = deviceData["core-temp"];
                history.cpu = deviceData["cpu-usage"];
                history.memory = deviceData["memory-usage"];
                history.videoBitrate = deviceData?.ndi["video-bit-rate"];
                history.audioBitrate = deviceData?.ndi["audio-bit-rate"];

                delete deviceData.ndi["discovery-server"];
                delete deviceData.ndi["group-name"];
                delete deviceData?.device;
                delete deviceData?.rndis;
                delete deviceData?.ethernet;
                delete deviceData["serial-no"];
                delete deviceData["up-time"];
                delete deviceData["input-state"];
                delete deviceData["core-temp"];
                delete deviceData["cpu-usage"];
                delete deviceData["memory-usage"];
                delete deviceData["fw-version"];
            } else {
                deviceData = { online: false };
            }

            const entry = await devicesCollection.updateOne(
                { deviceId: deviceId },
                {
                    $set: {
                        deviceId: deviceId,
                        timestamp: new Date(),
                        ...deviceData,
                    },
                    $push: {
                        history: {
                            $each: [{ ...history }],
                            $slice: -3000,
                        },
                    },
                },
                { upsert: true }
            );
        }
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    devicesCollection = await mongoCollection("devices");

    // and now create the index with ttl
    await mongoCreateIndex(devicesCollection, "timestamp", { expireAfterSeconds: updateDelay * 4 });

    while (true) {
        await getDeviceInfo();
        await delay(updateDelay);
    }
};

main();
