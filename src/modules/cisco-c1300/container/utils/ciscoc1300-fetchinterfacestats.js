"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");
const formatBps = require("@core/format-bps");
const trafficSaveHistory = require("../services/traffic-savehistory");

const convert32BitCounters = (results) => {
    // this switch incorrectly reports these OIDs as 64 bit even though they are 32 bit
    const output = {};
    Object.entries(results).forEach(([key, value]) => {
        if (value.length !== 4) {
            output[key] = 0;
        } else {
            output[key] = value.readInt32BE(0);
        }
    });
    return output;
}

module.exports = async function (config, snmpAwait) {

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");
    const historyCollection = await mongoCollection("history");

    // get list of interfaces
    const interfaces = await interfacesCollection.find().toArray();
    if (!interfaces?.length) {
        console.log("ciscoc1300-interfacestats: no interfaces found in db - waiting ...");
        await delay(5000);
        return;
    }

    // get subtree of interface input stats
    const ifInOctets = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.10",
        raw: true
    });
    const ifInOctets32Bit = convert32BitCounters(ifInOctets);

    // get subtree of interface output stats
    const ifOutOctets = await snmpAwait.subtree({
        maxRepetitions: 1000,
        oid: "1.3.6.1.2.1.2.2.1.16",
        raw: true
    });
    const ifOutOctets32Bit = convert32BitCounters(ifOutOctets);

    // do this now - in case updating the DB takes a while ...
    const sampleDate = new Date();

    const historyArray = [];
    const bulkOperations = [];

    for (let eachInterface of interfaces) {
        // we create a new object, and use $set in mongo, so we don't overwrite the main interface worker results
        const fieldsToUpdate = {};

        // fetch the values from the SNMP results
        const interfaceId = eachInterface.interfaceId;
        const inOctets = ifInOctets32Bit[`1.3.6.1.2.1.2.2.1.10.${interfaceId}`];
        const outOctets = ifOutOctets32Bit[`1.3.6.1.2.1.2.2.1.16.${interfaceId}`];

        let rxRate = 0;
        let txRate = 0;

        if (eachInterface["stats-date"] !== undefined) {
            // get millisecond-resolution dates to compare ...
            const previousMilliseconds = eachInterface["stats-date"].getTime();
            const currentMilliseconds = sampleDate.getTime();
            const differenceSeconds = (currentMilliseconds - previousMilliseconds) / 1000;

            // calculate the rates
            if (eachInterface["out-octets"] !== undefined) {
                txRate = ((outOctets - eachInterface["out-octets"]) / differenceSeconds) * 8;
            }
            if (eachInterface["in-octets"] !== undefined) {
                rxRate = ((inOctets - eachInterface["in-octets"]) / differenceSeconds) * 8;
            }
        }

        // save current values back
        fieldsToUpdate["out-octets"] = outOctets;
        fieldsToUpdate["in-octets"] = inOctets;
        fieldsToUpdate["stats-date"] = sampleDate;
        fieldsToUpdate["tx-rate"] = txRate;
        fieldsToUpdate["rx-rate"] = rxRate;

        // we copy these across from the db result - so they get updated too
        fieldsToUpdate["tx-history"] = eachInterface["tx-history"] ?? [];
        fieldsToUpdate["rx-history"] = eachInterface["rx-history"] ?? [];

        // if not empty, push value onto stats array (for spark line etc)
        if (eachInterface["tx-history"]?.length) {
            fieldsToUpdate["tx-history"].push({ value: txRate, timestamp: sampleDate });
            fieldsToUpdate["tx-history"] = fieldsToUpdate["tx-history"].slice(Math.max(fieldsToUpdate["tx-history"].length - 20, 0));
        }
        if (eachInterface["rx-history"]?.length) {
            fieldsToUpdate["rx-history"].push({ value: rxRate, timestamp: sampleDate });
            fieldsToUpdate["rx-history"] = fieldsToUpdate["rx-history"].slice(Math.max(fieldsToUpdate["rx-history"].length - 20, 0));
        }

        // and then lastly we need nicely formatted text versions
        fieldsToUpdate["tx-rate-text"] = formatBps(txRate);
        fieldsToUpdate["rx-rate-text"] = formatBps(rxRate);

        // save history
        historyArray.push({ id: interfaceId, "tx-rate": txRate, "rx-rate": rxRate });

        // add to bulk operations
        bulkOperations.push({
            updateOne: {
                filter: { interfaceId },
                update: { $set: fieldsToUpdate },
                upsert: false
            }
        });
    }

    // save all interface stats in one bulk operation
    if (bulkOperations.length) {
        await interfacesCollection.bulkWrite(bulkOperations);
    }

    // save history
    await trafficSaveHistory(historyCollection, historyArray);
};
