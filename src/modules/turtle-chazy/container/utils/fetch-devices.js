"use strict";
const turtleWebApi = require("./turtle-webapi");
const mongoCollection = require("@core/mongo-collection");

module.exports = async ({ address, uiPort }) => {

    const response = await turtleWebApi.get("cgi-bin/getjson.cgi?json=dante", { address });
    const devices = response?.dante ?? [];
    console.log(`fetch-devices: found ${devices.length} device(s)`);

    const devicesCollection = await mongoCollection("devices");
    const sourcesCollection = await mongoCollection("sources");
    const destinationsCollection = await mongoCollection("destinations");
    const routesCollection = await mongoCollection("routes");

    for (let eachDevice of devices) {

        const parsedDevice = {
            "name": eachDevice.name,
            "address": eachDevice.priip,
            "manufacturer": eachDevice.manfname,
            "mac": eachDevice.primac,
            "model": eachDevice.manfmodel,
            "modelVersion": eachDevice.modelver,
            "danteModel": eachDevice.dantemodel,
            "softwareVersion": eachDevice.swver,
            "sync": eachDevice.sync,
            "rxLatencyMin": eachDevice.rxlatencymin,
            "rxLatency": eachDevice.rxlatency,
            "rxLatencyMax": eachDevice.rxlatencymax,
            "lock": eachDevice.lock,
            "sampleRate": eachDevice.srate,
            "timestamp": new Date(),
            "active": true
        }

        // save to devices collection
        await devicesCollection.replaceOne(
            { "name": eachDevice.name }, parsedDevice, { "upsert": true })

        // get source labels
        const sources = eachDevice.txchn.filter((c) => c.type === "audio").map((c) => {
            return {
                "name": c.name,
                "index": c.id
            }
        });
        await sourcesCollection.replaceOne(
            { "deviceId": eachDevice.name }, { deviceId: eachDevice.name, "labels": sources, "timestamp": new Date() }, { "upsert": true })

        // get destination labels
        const destinations = eachDevice.rxchn.filter((c) => c.type === "audio").map((c) => {
            return {
                "name": c.name,
                "index": c.id
            }
        });
        await destinationsCollection.replaceOne(
            { "deviceId": eachDevice.name }, { deviceId: eachDevice.name, "labels": destinations, "timestamp": new Date() }, { "upsert": true })

        // and finally, routes
        const routes = eachDevice.rxchn.filter((rxc) => rxc.status === "DYNAMIC").map((c) => {
            const sourceDevice = devices.find((d) => d.name === c.subdev);
            const sourceChannel = sourceDevice.txchn.find((txc) => txc.name === c.subchn);

            // // if sourcedevice is set, but sourceindex isn't, then the source is missing - mark as MISSING
            // let sourceStatus = c?.status;
            // if (sourceDevice?.name && !sourceChannel?.id) {
            //     sourceStatus = "MISSING";
            // }

            return {
                // "destinationDevice": eachDevice.name,
                "destinationChannel": c.name,
                "destinationIndex": c.id,
                "sourceDevice": sourceDevice?.name,
                "sourceChannel": sourceChannel?.name,
                "sourceIndex": sourceChannel?.id,
                // "sourceStatus": sourceStatus

            }
        });
        await routesCollection.replaceOne(
            { "deviceId": eachDevice.name }, { deviceId: eachDevice.name, "routes": routes, "timestamp": new Date() }, { "upsert": true })
    }

    // expire all the devices that we didn't fetch
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    await devicesCollection.updateMany(
        { timestamp: { $lt: thirtySecondsAgo } },
        { $set: { active: false } }
    );

    // delete all non-active devices with duplicate MAC addresses (probably renamed)
    const macList = devices.map((d) => d.primac);
    await devicesCollection.deleteMany(
        { mac: { $in: macList }, "active": false },
    );

};


