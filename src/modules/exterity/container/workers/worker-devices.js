"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const modulePort = process.env.PORT;
const axios = require("axios");

let devicesCollection;
// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["devices"],
});

let updateDelay = 5000;

const filteredResponse = (response) => {
    return {
        name: response?.name?.value,
        location: response?.location?.value,
        address: response[IPAddress]?.value,
        currentChannel: response?.currentChannel?.value,
        timestamp: new Date(),
    };
};

const getDeviceData = async (deviceId, device) => {
    const options = { timeout: 10000 };
    //Check if the receiver needs a username and password
    if (device.username || device.password) {
        options.auth = {
            username: device.username,
            password: device.password,
        };
    }

    const response = await axios.get(`http://${device.address}/cgi-bin/config.json.cgi`, options);
    if (response.data) {
        console.log(response.data);
        const data = await filteredResponse(response.data);
        data.deviceId = deviceId;
        await devicesCollection.insertOne({ deviceId: deviceId }, panelStatus, { upsert: true });
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    devicesCollection = await mongoCollection("devices");

    // remove previous values
    devicesCollection.deleteMany({});

    while (true) {
        for (let device of workerData.devices) {
            await getDeviceData(device);
        }
        await delay(updateDelay);
    }
};

main();
