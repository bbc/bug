"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");
const formatBps = require("@core/format-bps");
const trafficSaveHistory = require("../services/traffic-savehistory");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {
    let interfacesCollection;
    let historyCollection;

    try {
        // get collections
        interfacesCollection = await mongoCollection("interfaces");
        historyCollection = await mongoCollection("history");

        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();
        if (!interfaces?.length) {
            console.log("arista-fetchinterfacestats: no interfaces found in db - waiting ...");
            await delay(5000);
            return;
        }

        // fetch stats from device
        const result = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["show interfaces counters"],
        });

        if (!result?.interfaces) {
            throw new Error("no interface stats returned from device");
        }

        const sampleDate = new Date();
        const historyArray = [];
        let interfaceCount = 0;

        // loop through stored interfaces
        for (const eachInterface of interfaces) {
            const apiResult = result.interfaces[eachInterface.interfaceId];
            if (!apiResult) continue;

            const fieldsToUpdate = {};
            let rxRate = 0;
            let txRate = 0;

            const inOctets = apiResult.inOctets;
            const outOctets = apiResult.outOctets;

            if (eachInterface["stats-date"]) {
                const prevMs = eachInterface["stats-date"].getTime();
                const currMs = sampleDate.getTime();
                const diffSec = (currMs - prevMs) / 1000;

                if (eachInterface["out-octets"] !== undefined) {
                    txRate = ((outOctets - eachInterface["out-octets"]) / diffSec) * 8;
                }
                if (eachInterface["in-octets"] !== undefined) {
                    rxRate = ((inOctets - eachInterface["in-octets"]) / diffSec) * 8;
                }
            }

            // save current values
            fieldsToUpdate["out-octets"] = outOctets;
            fieldsToUpdate["in-octets"] = inOctets;
            fieldsToUpdate["stats-date"] = sampleDate;
            fieldsToUpdate["tx-rate"] = txRate;
            fieldsToUpdate["rx-rate"] = rxRate;

            // preserve or initialize history arrays
            fieldsToUpdate["tx-history"] = eachInterface["tx-history"] || [];
            fieldsToUpdate["rx-history"] = eachInterface["rx-history"] || [];

            fieldsToUpdate["tx-history"].push({ value: txRate, timestamp: sampleDate });
            fieldsToUpdate["rx-history"].push({ value: rxRate, timestamp: sampleDate });

            // keep only last 20 samples
            fieldsToUpdate["tx-history"] = fieldsToUpdate["tx-history"].slice(-20);
            fieldsToUpdate["rx-history"] = fieldsToUpdate["rx-history"].slice(-20);

            // formatted text versions
            fieldsToUpdate["tx-rate-text"] = formatBps(txRate);
            fieldsToUpdate["rx-rate-text"] = formatBps(rxRate);

            // add to history array for separate history collection
            historyArray.push({
                id: eachInterface.interfaceId,
                "tx-rate": txRate,
                "rx-rate": rxRate,
            });

            // save back to db
            await interfacesCollection.updateOne(
                { interfaceId: eachInterface.interfaceId },
                { $set: fieldsToUpdate }
            );

            interfaceCount += 1;
        }

        console.log(
            `arista-fetchinterfacestats: updated stats for ${interfaceCount} interface(s), pushed ${historyArray.length} stat(s) to interface history`
        );

        // save history
        await trafficSaveHistory(historyCollection, historyArray);

    } catch (err) {
        console.error(`arista-fetchinterfacestats failed: ${err.message}`);
        throw err;
    }
};
