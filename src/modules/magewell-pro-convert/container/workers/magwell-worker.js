"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const axios = require("axios");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const md5 = require("md5");

const updateDelay = 5000;
let sourceCollection;
let networkCollection;
let status;
let cookie;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const getSources = async () => {
    const response = await axios.get(`http://${workerData.address}/mwapi`, {
        headers: {
            Cookie: cookie,
        },
        params: { method: "get-ndi-sources" },
    });
    if (response.data.status === 0) {
        const sources = [];
        for (let source of response.data.sources) {
            sources.push({
                label: source["ndi-name"],
                address: source["ip-addr"],
                id: source["ip-addr"],
            });
        }
        await mongoSaveArray(sourceCollection, sources, "id");
    }
    status = response.data.status;
};

const getNetworkStatus = async () => {
    const response = await axios.get(`http://${workerData.address}/mwapi`, {
        headers: {
            Cookie: cookie,
        },
        params: { method: "get-eth-status" },
    });
    if (response.data.status === 0) {
        delete response.data.status;
        const entry = await networkCollection.insert({
            tx: response.data["tx-speed-kbps"],
            rx: response.data["rx-speed-kbps"],
        });
    }
    status = response.data.status;
};

const getSignalInfo = async () => {
    const response = await axios.get(`http://${workerData.address}/mwapi`, {
        headers: {
            Cookie: cookie,
        },
        params: { method: "get-signal-info" },
    });
    if (response.data.status === 0) {
        console.log(response.data);
    }
    status = response.data.status;
};

const getProductInfo = async () => {
    const response = await axios.get(`http://${workerData.address}/mwapi`, {
        headers: {
            Cookie: cookie,
        },
        params: { method: "get-caps" },
    });
    if (response.data.status === 0) {
        console.log("PRODUCT INFO");
    }
    status = response.data.status;
};

const ping = async () => {
    const response = await axios.get(`http://${workerData.address}/mwapi`, {
        params: {
            method: "ping",
        },
    });

    if (response?.data?.status === 0) {
        return true;
    }
    return false;
};

const login = async () => {
    const hash = await md5(workerData?.password);
    const response = await axios.get(`http://${workerData.address}/mwapi`, {
        params: {
            method: "login",
            id: workerData?.username,
            pass: hash,
        },
    });

    if (response.data.status === 0) {
        cookie = response.headers["set-cookie"];
        console.log("magewell-pro-convert: Device login successful");
    } else {
        console.log("magewell-pro-convert: Device login failed");
    }
    status = response.data.status;
};

const logout = async () => {
    const response = await axios.get(`http://${workerData.address}/mwapi`, {
        params: {
            method: "logout",
        },
    });
    console.log("magewell-pro-convert: Device logout");
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    sourceCollection = await mongoCollection("sources");
    sourceCollection.deleteMany({});

    // get the collection reference
    networkCollection = await mongoCollection("network", { expireAfterSeconds: 3600 });
    networkCollection.deleteMany({});

    // and now create the index with ttl
    await mongoCreateIndex(sourceCollection, "timestamp", { expireAfterSeconds: 60 });

    if (workerData.address) {
        if (!(await ping())) {
            throw new Error("Magewell not reachable");
        }
        while (true) {
            if (status !== 0) {
                await login();
            }
            await getNetworkStatus();
            await getProductInfo();
            await getSignalInfo();
            await getSources();
            // poll occasionally
            await delay(updateDelay);
        }
    }

    throw new Error("No IP Address provided");
};

main();
