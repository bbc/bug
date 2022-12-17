"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const formatBps = require("@core/format-bps");
const trafficSaveHistory = require("../services/traffic-savehistory");
const mongoCreateIndex = require("@core/mongo-createindex");
const aristaApi = require("@utils/arista-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
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

    while (true) {
        await delay(5000);
        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces) {
            console.log("worker-interfacestats: no interfaces found in db - waiting ...");
            await delay(5000);
        } else {
            // get stats from device
            const result = await aristaApi({
                host: workerData.address,
                protocol: "https",
                port: 443,
                username: workerData.username,
                password: workerData.password,
                commands: ["show interfaces counters"],
            });

            // console.log(result);

            // do this now - in case updating the DB takes a while ...
            const sampleDate = new Date();

            const historyArray = [];

            // loop through each stored interface
            for (let eachInterface of interfaces) {
                const interfaceResultFromApi = result?.interfaces?.[eachInterface.interfaceId];
                if (interfaceResultFromApi) {
                    // found a result - we can use it to update the db

                    // we create a new object, and use $set in mongo, so we don't overwrite the main interface worker results
                    const fieldsToUpdate = {};

                    let rxRate = 0;
                    let txRate = 0;

                    // fetch the values from the SNMP results
                    const inOctets = interfaceResultFromApi.inOctets;
                    const outOctets = interfaceResultFromApi.outOctets;

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
                    fieldsToUpdate["tx-history"] = eachInterface["tx-history"];
                    fieldsToUpdate["rx-history"] = eachInterface["rx-history"];

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
                        id: eachInterface.interfaceId,
                        "tx-rate": txRate,
                        "rx-rate": rxRate,
                    });

                    // save back to database
                    await interfacesCollection.updateOne(
                        {
                            interfaceId: eachInterface.interfaceId,
                        },
                        { $set: fieldsToUpdate }
                    );
                }
            }

            // save history
            await trafficSaveHistory(historyCollection, historyArray);
        }

        await delay(5000);
    }
};

main();
