"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const formatBps = require("@core/format-bps");
const trafficSaveHistory = require("../services/traffic-savehistory");
const mongoCreateIndex = require("@core/mongo-createindex");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");
    const historyCollection = await mongoCollection("history");

    // and now create indexes with ttl
    await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

    // Kick things off
    console.log(`worker-interfacestats: connecting to device at ${workerData.address}`);

    const data = {
        fields: "name;statistics/in-octets;statistics/out-octets",
    };

    while (true) {
        // get the list of interfaces from last time (so we can calculate bps)
        const interfaces = await interfacesCollection.find().toArray();

        // do this now - in case updating the DB takes a while ...
        const sampleDate = new Date();

        const historyArray = [];

        const result = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces/interface",
            data: data,
            timeout: parseInt(workerData["timeout"] ? workerData["timeout"] : 5000),
            username: workerData["username"],
            password: workerData["password"],
        });

        for (const eachInterface of result?.["Cisco-IOS-XE-interfaces-oper:interface"]) {
            // we create a new object, and use $set in mongo, so we don't overwrite the main interface worker results
            const fieldsToUpdate = {};

            const outOctets = parseInt(eachInterface["statistics"]["out-octets"]);
            const inOctets = parseInt(eachInterface["statistics"]["in-octets"]);

            let rxRate = 0;
            let txRate = 0;

            // find the previous value from the db
            const previousInterface = interfaces.find((iface) => iface.interfaceId === eachInterface.name);
            if (previousInterface) {
                if (previousInterface["stats-date"] !== undefined) {
                    // get millisecond-resolution dates to compare ...
                    const previousMilliseconds = previousInterface["stats-date"].getTime();
                    const currentMilliseconds = sampleDate.getTime();
                    const differenceSeconds = (currentMilliseconds - previousMilliseconds) / 1000;

                    // calculate the rates
                    if (previousInterface["out-octets"] !== undefined) {
                        txRate = ((outOctets - previousInterface["out-octets"]) / differenceSeconds) * 8;
                    }
                    if (previousInterface["in-octets"] !== undefined) {
                        rxRate = ((inOctets - previousInterface["in-octets"]) / differenceSeconds) * 8;
                    }
                }

                // save current values back
                fieldsToUpdate["out-octets"] = outOctets;
                fieldsToUpdate["in-octets"] = inOctets;
                fieldsToUpdate["stats-date"] = sampleDate;
                fieldsToUpdate["tx-rate"] = txRate;
                fieldsToUpdate["rx-rate"] = rxRate;

                // we copy these across from the db result - so they get updated too
                fieldsToUpdate["tx-history"] = previousInterface["tx-history"];
                fieldsToUpdate["rx-history"] = previousInterface["rx-history"];

                // check we have empty arrays
                if (fieldsToUpdate["tx-history"] === undefined) {
                    fieldsToUpdate["tx-history"] = [];
                } else {
                    // if not, push value onto stats array (for spark line etc)
                    fieldsToUpdate["tx-history"].push({
                        value: txRate,
                        timestamp: sampleDate,
                    });
                    fieldsToUpdate["tx-history"] = fieldsToUpdate["tx-history"].slice(
                        Math.max(fieldsToUpdate["tx-history"].length - 20, 0)
                    );
                }
                if (fieldsToUpdate["rx-history"] === undefined) {
                    fieldsToUpdate["rx-history"] = [];
                } else {
                    // if not, push value onto stats array (for spark line etc)
                    fieldsToUpdate["rx-history"].push({
                        value: rxRate,
                        timestamp: sampleDate,
                    });
                    fieldsToUpdate["rx-history"] = fieldsToUpdate["rx-history"].slice(
                        Math.max(fieldsToUpdate["rx-history"].length - 20, 0)
                    );
                }

                // and then lastly we need nicely formatted text versions
                fieldsToUpdate["tx-rate-text"] = formatBps(txRate);
                fieldsToUpdate["rx-rate-text"] = formatBps(rxRate);

                // save history
                historyArray.push({
                    id: eachInterface.name,
                    "tx-rate": txRate,
                    "rx-rate": rxRate,
                });

                // save back to database
                await interfacesCollection.updateOne(
                    {
                        interfaceId: eachInterface.name,
                    },
                    { $set: fieldsToUpdate }
                );
            }
        }

        await delay(5000);
    }
};

main();
