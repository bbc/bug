const { parentPort, workerData, threadId } = require("worker_threads");

const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");

const mongoDb = require("../utils/mongo-db");
const mongoCollection = require("../utils/mongo-collection");

const mikrotikFetchInterfaces = require("../services/mikrotik-fetchinterfaces");
const arraySaveMongo = require("../services/array-savemongo");

const delayMs = 2000;
const errorDelayMs = 10000;
const config = workerData.config;

//Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["address", "username", "password"],
});

const pollDevice = async () => {
    const interfacesCollection = await mongoCollection("interfaces");

    const conn = new RosApi({
        host: config.address,
        user: config.username,
        password: config.password,
        timeout: 5,
    });

    try {
        console.log("fetch-interfaces: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        console.log("fetch-interfaces: failed to connect to device");
        return;
    }
    console.log("fetch-interfaces: device connected ok");

    let noErrors = true;
    console.log("fetch-interfaces: starting device poll....");
    while (noErrors) {
        try {
            const interfaces = await mikrotikFetchInterfaces(conn);
            await arraySaveMongo(interfacesCollection, interfaces, "id");
        } catch (error) {
            console.log("fetch-interfaces: ", error);
            noErrors = false;
        }
        await delay(delayMs);
    }
    await conn.close();
};

const main = async () => {
    //Connect to the db
    await mongoDb.connect(config.id);

    //Kick things off
    while (true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log("fetch-interfaces: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
