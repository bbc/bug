"use strict";

const turtleWebApi = require("@utils/turtle-webapi");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async ({ workerData }) => {
    const response = await turtleWebApi.get("cgi-bin/getjson.cgi?json=dante", { address: workerData.address });
    const devices = response?.dante ?? [];
    logger.info(`found ${devices.length} device(s)`);

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
            "active": true,
        };

        await devicesCollection.replaceOne(
            { "name": eachDevice.name }, parsedDevice, { "upsert": true }
        );

        const sources = eachDevice.txchn.filter((c) => c.type === "audio").map((c) => {
            return {
                "name": c.name,
                "index": c.id,
            };
        });
        await sourcesCollection.replaceOne(
            { "deviceId": eachDevice.name }, { deviceId: eachDevice.name, "labels": sources, "timestamp": new Date() }, { "upsert": true }
        );

        const destinations = eachDevice.rxchn.filter((c) => c.type === "audio").map((c) => {
            return {
                "name": c.name,
                "index": c.id,
                "status": c.status,
            };
        });
        await destinationsCollection.replaceOne(
            { "deviceId": eachDevice.name }, { deviceId: eachDevice.name, "labels": destinations, "timestamp": new Date() }, { "upsert": true }
        );

        const routes = eachDevice.rxchn.filter((rxc) => rxc.status !== "NONE").map((c) => {
            const sourceDevice = devices.find((d) => d.name === c.subdev);
            const sourceChannel = sourceDevice?.txchn.find((txc) => txc.name === c.subchn);

            return {
                "destinationChannel": c.name,
                "destinationIndex": c.id,
                "sourceDevice": sourceDevice?.name,
                "sourceChannel": sourceChannel?.name,
                "sourceIndex": sourceChannel?.id,
                "status": c.status,
            };
        });
        await routesCollection.replaceOne(
            { "deviceId": eachDevice.name }, { deviceId: eachDevice.name, "routes": routes, "timestamp": new Date() }, { "upsert": true }
        );
    }

    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    await devicesCollection.updateMany(
        { timestamp: { $lt: thirtySecondsAgo } },
        { $set: { active: false } }
    );

    const macList = devices.map((d) => d.primac);
    await devicesCollection.deleteMany(
        { mac: { $in: macList }, "active": false }
    );
};