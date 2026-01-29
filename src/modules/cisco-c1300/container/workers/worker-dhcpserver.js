"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const axios = require("axios");
const modulePort = process.env.PORT;
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["dhcpSources"],
});

const fetchDhcpLeases = async (dhcpSource) => {
    const url = `http://${dhcpSource}:${modulePort}/api/capabilities/dhcp-server`;

    try {
        const response = await axios.get(url);
        if (response?.data?.status === "success" && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (err) {
        console.error(`worker-dhcpserver: failed to fetch from ${dhcpSource}`);
        console.error(err.stack || err.message || err);
        return [];
    }
};

const main = async () => {
    try {
        // stagger start of script ...
        await delay(4000);

        // Connect to the db
        await mongoDb.connect(workerData?.id);

        while (true) {
            let dhcpLeases = [];

            // loop through each dhcp source and fetch the list
            if (Array.isArray(workerData?.dhcpSources)) {
                for (const dhcpSource of workerData.dhcpSources) {
                    const leases = await fetchDhcpLeases(dhcpSource);
                    dhcpLeases = dhcpLeases.concat(leases);
                }
            }

            // store leases in mongo
            await mongoSingle.set("leases", dhcpLeases, 60);

            // every 30 seconds
            await delay(30000);
        }
    } catch (err) {
        console.error(`worker-dhcpserver: unexpected error`);
        console.error(err.stack || err.message || err);
    }
};

main();
