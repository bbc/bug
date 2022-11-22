"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const modulePort = process.env.PORT;
const axios = require("axios");
const mongoCollection = require("@core/mongo-collection");
const getChannelListUrl = require("@utils/getChannelListUrl");
const setChannelListUrl = require("@services/channel-list-set");

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
        address: response["IPAddress"]?.value,
        currentChannel: response?.currentChannel?.value,
        serialNumber: response?.serialNumber?.value,
        version: response?.softwareVersion?.value,
        volume: response?.volume?.value,
        timestamp: new Date(),
        channelListUrl: response?.xmlChannelListUrl?.value,
        channelListType: response?.channelListType?.value,
    };
};

const getDeviceData = async (deviceId, device = {}) => {
    const options = { timeout: 10000 };
    //Check if the receiver needs a username and password
    if (device.username || device.password) {
        options.auth = {
            username: device?.username,
            password: device?.password,
        };
    }

    let response = null;
    try {
        response = await axios.get(`http://${device.address}/cgi-bin/config.json.cgi`, options);
    } catch (err) {
        console.log(`worker-devices: failed to get data from ${deviceId}`);
    }

    if (response && response.data) {
        const data = await filteredResponse(response.data);
        const channelListUrl = await getChannelListUrl(deviceId);
        if (channelListUrl !== data.channelListUrl || data?.channelListType !== "xml") {
            const response = await setChannelListUrl(deviceId);
        }

        data.deviceId = deviceId;
        data.online = true;
        await devicesCollection.updateOne(
            { deviceId: deviceId },
            {
                $set: data,
            },
            { upsert: true }
        );
    } else {
        const data = { online: false };
        await devicesCollection.updateOne(
            { deviceId: deviceId },
            {
                $set: data,
            },
            { upsert: true }
        );
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
        for (let deviceId in workerData.devices) {
            console.log(`worker-devices: getting data from ${deviceId}`);
            await getDeviceData(deviceId, workerData.devices[deviceId]);
        }
        await delay(updateDelay);
    }
};

main();
