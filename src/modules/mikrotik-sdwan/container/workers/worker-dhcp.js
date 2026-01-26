"use strict";

const { parentPort, workerData } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const mikrotikFetchDhcpLeases = require("@utils/mikrotik-fetchdhcpleases");
const mikrotikFetchServers = require("@utils/mikrotik-fetchservers");
const mikrotikFetchDhcpNetworks = require("@utils/mikrotik-fetchdhcpnetworks");
const updateDelay = 5000;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    let conn;
    try {
        // connect to the db
        await mongoDb.connect(workerData.id);

        // clear existing data
        await mongoSingle.clear("dhcp");

        conn = new RosApi({
            host: workerData.address,
            user: workerData.username,
            password: workerData.password,
            timeout: 10,
        });

        console.log(`worker-dhcp: connecting to ${workerData.address}`);
        await conn.connect();
        console.log("worker-dhcp: device connected ok");

        console.log("worker-dhcp: starting device poll....");

        // loop until an error occurs, then exit so the manager restarts the thread.
        while (true) {
            try {
                // fetch and update leases
                const dhcpLeases = await mikrotikFetchDhcpLeases(conn);
                await mongoSingle.set("dhcpLeases", dhcpLeases, 60);

                // fetch and update servers
                const servers = await mikrotikFetchServers(conn);
                await mongoSingle.set("dhcpServers", servers, 60);

                // fetch and update networks
                const dhcpNetworks = await mikrotikFetchDhcpNetworks(conn);
                await mongoSingle.set("dhcpNetworks", dhcpNetworks, 60);

            } catch (error) {
                // log error and throw to break the while(true) loop
                console.error(`worker-dhcp polling error: ${error.message}`);
                throw error;
            }

            await delay(updateDelay);
        }
    } catch (error) {
        // catches the throw from the loop or initial connection/db failure
        console.error(`worker-dhcp fatal error: ${error.message}`);
    } finally {
        // ensure connection is cleaned up before the thread exits
        if (conn) {
            console.log("worker-dhcp: closing connection");
            await conn.close().catch(() => { });
        }
    }
};

main();