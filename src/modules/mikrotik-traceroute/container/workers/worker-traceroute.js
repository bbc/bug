"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const { IPinfoWrapper, LruCache } = require("node-ipinfo");
const delay = require("delay");
const register = require("module-alias/register");
const mikrotikTraceroute = require("../services/traceroute-mikrotik");
const parseTraceroute = require("../services/traceroute-parse");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");

let ipInfo;
const seenLocations = [];

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["traceroutes", "token", "frequency"],
});

const main = async () => {
    let errors = false;
    const frequency = (parseInt(workerData.frequency) || 60) * 1000;

    const cache = new LruCache({
        max: 100,
        maxAge: 1 * 1000 * 60 * 60,
    });
    ipInfo = await new IPinfoWrapper(workerData.token, cache);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    const tracerouteCollection = await mongoCollection("traceroute");
    await tracerouteCollection.deleteMany({});

    while (!errors) {
        for (let tracerouteId in workerData.traceroutes) {
            const traceroute = await getTraceroute(workerData.traceroutes[tracerouteId]);
            if (traceroute) {
                traceroute[0].loc = workerData.traceroutes[tracerouteId]?.startPosition;
                const query = { tracerouteId: tracerouteId };
                const update = {
                    $set: {
                        ...{
                            hops: traceroute,
                            timestamp: new Date(),
                            tracerouteId: tracerouteId,
                            name: workerData.traceroutes[tracerouteId].name,
                        },
                    },
                };
                const options = { upsert: true };
                tracerouteCollection.updateOne(query, update, options);
            }
        }
        await delay(frequency);
    }
};

const ditherLocation = async (location) => {
    let newLocation = [];
    for (let i in location) {
        const dither = Math.random() / 1000;
        newLocation[i] = location[i] + dither;
    }
    return newLocation;
};

const getTraceroute = async (traceroute) => {
    //Connect to MikroTike
    const mikrotik = await new RosApi({
        host: traceroute.address,
        user: traceroute.username,
        password: traceroute.password,
        timeout: 5,
    });

    console.log("worker-traceroute: starting...");

    // initial delay (to stagger device polls)
    await delay(2000);

    try {
        console.log(`worker-traceroute: connecting to ${traceroute.address}`);
        await mikrotik.connect();

        console.log("worker-traceroute: device connected ok");
    } catch (error) {
        console.log(`worker-traceroute: failed to connect to ${traceroute.address}`);
        return;
    }

    let result = await mikrotikTraceroute(mikrotik, traceroute.targetAddress);
    result = await parseTraceroute(ipInfo, result);

    //Make any initial private IP default to set start location
    for (let item in result) {
        if (!result[item].loc) {
            result[item].loc = traceroute.startPosition;
        } else {
            break;
        }
    }

    //If location is identical to antoher one then dither it
    for (let item in result) {
        if (!seenLocations.includes(JSON.stringify())) {
            seenLocations.push(JSON.stringify(result[item].loc));
            result[item].loc = await ditherLocation(result[item].loc);
        }
    }

    await mikrotik.close();

    return result;
};

main();
