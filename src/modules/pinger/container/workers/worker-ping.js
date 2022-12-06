"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const ping = require("ping");
const mongoCreateIndex = require("@core/mongo-createindex");

let hostsCollection;
// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["hosts"],
});

const config = {
    timeout: 10,
    extra: ["-i", "5"],
};

const filteredResponse = (response) => {
    return {
        min: response?.min,
        max: response?.max,
        avg: response?.avg,
        stddev: response?.stddev,
        packetLoss: response?.packetLoss,
        timestamp: new Date(),
    };
};

const findHost = (hosts, hostId) => {
    for (let exisitingHost of hosts) {
        if (exisitingHost.hostId === hostId) {
            return exisitingHost;
        }
    }
    return null;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);
    hostsCollection = await mongoDb.db.collection("hosts");

    await mongoCreateIndex(hostsCollection, "timestamp", { expireAfterSeconds: workerData.frequency * 10 });

    while (true) {
        const hosts = await hostsCollection.find({}).toArray();

        const pingsPerDay = parseInt((1 / workerData.frequency) * 60 * 60 * 24);

        if (workerData.hosts) {
            for (let hostId in workerData.hosts) {
                const host = workerData.hosts[hostId];

                //console.log(`Pinging ${host.host}`);

                //const host = workerData.hosts.hostId;
                const exisitingHost = findHost(hosts, hostId);

                if (!exisitingHost || exisitingHost.lastPinged < new Date() - workerData.frequency * 1000) {
                    const response = await ping.promise.probe(host.host, {
                        timeout: 1,
                        extra: ["-c", "2"],
                    });

                    //console.log(`Pinged ${host.host}`);

                    //Add database entry
                    const query = { host: host?.host };
                    const currentEntry = await hostsCollection.findOne(query);
                    const update = {
                        $set: {
                            timestamp: new Date(),
                            lastPinged: response?.alive ? new Date() : currentEntry?.lastPinged,
                            lastOutage: response?.alive ? currentEntry?.lastOutage : new Date(),
                            lastOutageDuration: response?.alive
                                ? currentEntry?.lastOutageDuration
                                : new Date() - new Date(currentEntry?.lastPinged),
                            time: response?.avg,
                            alive: response?.alive,
                            hostId: hostId,
                        },
                        $push: {
                            data: {
                                $each: [{ ...filteredResponse(response) }],
                                $slice: -pingsPerDay,
                                $sort: { timestamp: 1 },
                            },
                        },
                    };
                    const options = { upsert: true };
                    hostsCollection.updateOne(query, update, options);
                }
            }
        }
    }
};

main();
