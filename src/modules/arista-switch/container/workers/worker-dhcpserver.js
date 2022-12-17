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

const main = async () => {
    // stagger start of script ...
    await delay(1000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    while (true) {
        let dhcpLeases = [];

        // loop through each dhcp source and fetch the list
        for (const dhcpSource of workerData?.dhcpSources) {
            const url = `http://${dhcpSource}:${modulePort}/api/capabilities/dhcp-server`;
            try {
                // make the request
                const response = await axios.get(url);
                if (response?.data?.status === "success" && Array.isArray(response?.data?.data)) {
                    dhcpLeases = dhcpLeases.concat(response.data.data);
                }
            } catch (error) {
                console.log(`worker-dhcpserver: ${error.stack || error.trace || error || error.message}`);
            }
        }

        await mongoSingle.set("leases", dhcpLeases, 60);

        // every 30 seconds
        await delay(30000);
    }
};

main();
