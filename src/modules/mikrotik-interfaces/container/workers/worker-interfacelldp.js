"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mikrotikFetchLldp = require("../services/mikrotik-fetchlldp");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 5000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // stagger start of script ...
    await delay(1000);

    // Connect to the db
    await mongoDb.connect(workerData.id);
    const interfacesCollection = await mongoCollection("interfaces");

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 15,
    });

    try {
        console.log("worker-interfacelldp: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        throw "worker-interfacelldp: failed to connect to device";
    }
    console.log("worker-interfacelldp: device connected ok");

    let noErrors = true;
    console.log("worker-interfacelldp: starting device poll....");
    while (noErrors) {
        try {
            const lldp = await mikrotikFetchLldp(conn);

            // group by interface
            const lldpByInterface = {};
            for (let eachEntry of lldp) {
                // clone and tidy up a few fields we don't need
                const eachEntryClone = Object.assign({}, eachEntry);
                delete eachEntryClone?.interface;
                delete eachEntryClone?.id;
                delete eachEntryClone?.unpack;
                delete eachEntryClone?.["system-caps"];
                delete eachEntryClone?.["system-caps-enabled"];

                for (let eachInterface of eachEntry?.interface) {
                    if (lldpByInterface[eachInterface] === undefined) {
                        lldpByInterface[eachInterface] = [];
                    }
                    lldpByInterface[eachInterface].push(eachEntryClone);
                }
            }

            for (let [interfaceName, lldpObject] of Object.entries(lldpByInterface)) {
                await interfacesCollection.updateOne(
                    { "default-name": interfaceName },
                    {
                        $set: {
                            lldp: lldpObject,
                        },
                    },
                    { upsert: false }
                );
            }
        } catch (error) {
            console.log("worker-interfacelldp: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();
