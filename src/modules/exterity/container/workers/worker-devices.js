"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const modulePort = process.env.PORT;
const mongoCollection = require("@core/mongo-collection");
const getChannelListUrl = require("@utils/getChannelListUrl");
const setChannelListUrl = require("@services/channel-list-set");
const http = require("http");

let devicesCollection;
// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["devices"],
});

let updateDelay = 3000;

const filteredResponse = (response) => {
    const modelLookup = {
        CDT: "IBM",
        DEL: "Dell",
        DLL: "Dell",
        FDT: "Fujitsu",
        FUJ: "Fujitsu",
        GSM: "LG",
        HCE: "Hitachi",
        HIT: "Hitachi",
        HTC: "Hitachi",
        MDO: "Panasonic",
        MEE: "Mistubishi",
        PHL: "Philips",
        SAM: "Samsung",
        SAN: "Sanyo",
        SHP: "Sharp",
        SNY: "Sony",
        SON: "Sony",
        SSE: "Samsung",
    };

    const modelName = modelLookup[response?.tv?.manufacturer] || "Unknown";

    return {
        timestamp: new Date(),
        name: response?.Name,
        location: response?.Location,
        address: response?.IPAddress,
        currentChannel: response?.currentChannel,
        serialNumber: response?.serialNumber,
        version: response?.SoftwareVersion,
        model: modelName,
        channelListUrl: response?.xmlChannelListUrl,
        channelListType: response?.rStaticChannelsl,
        volume: response?.receivervolume,
        mute: response?.mute,
        uptime: response?.upTime,
    };
};

//Exterity boxes return LFCR invalid chars in responses so commands always throw expections. Manually parse the repsonse using HTTP
const getExterityData = (device) => {
    return new Promise(function (resolve, reject) {
        const options = {
            insecureHTTPParser: true,
            timeout: 3000,
        };

        const params = {
            currentMode: true,
            receivervolume: true,
            mute: true,
            audioOptions: true,
            currentChannel: true,
            serialNumber: true,
            IPAddress: true,
            Location: true,
            Name: true,
            SoftwareVersion: true,
            tv: true,
            xmlChannelListUrl: true,
            rStaticChannelsl: true,
            upTime: true,
        };

        if (device.username || device.password) {
            options.auth = `${device?.username}:${device?.password}`;
        }

        options.host = `${device.address}`;
        options.path = `/cgi-bin/json_xfer?${new URLSearchParams(params)}`;

        const callback = (response) => {
            let str = "";

            response.on("data", function (chunk) {
                str += chunk;
            });
            response.on("end", function () {
                const jsonData = JSON.parse(str.trim());
                resolve(jsonData);
            });
        };

        try {
            const request = http.request(options, callback);

            request.on("timeout", () => {
                reject(err);
            });

            request.on("error", function (err) {
                reject(err);
            });

            request.end();
        } catch (err) {
            reject(err);
        }
    });
};

const getDeviceData = async (deviceId, device = {}) => {
    let response = null;

    try {
        response = await getExterityData(device);
    } catch (err) {
        console.log(`worker-devices: failed to get data from ${deviceId}`);
    }

    if (response) {
        const data = await filteredResponse(response);
        const channelListUrl = await getChannelListUrl(deviceId);

        if (channelListUrl !== data.channelListUrl || data?.channelListType === false) {
            const status = await setChannelListUrl(deviceId);
            console.log(`worker-devices: Updated channel list to ${channelListUrl}`);
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
    //devicesCollection.deleteMany({});

    while (true) {
        for (let deviceId in workerData.devices) {
            //console.log(`worker-devices: getting data from ${deviceId}`);
            await getDeviceData(deviceId, workerData.devices[deviceId]);
        }
        await delay(updateDelay);
    }
};

main();
