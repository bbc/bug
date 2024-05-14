"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");
const { SlowBuffer } = require("buffer");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const convertPortSpeed = (speed) => {
    switch (speed) {
        case 10000000:
            return "10M";
        case 100000000:
            return "100M";
        case 1000000000:
            return "1G";
        case 10000000000:
            return "10G";
        case 25000000000:
            return "25G";
        case 40000000000:
            return "40G";
        case 50000000000:
            return "50G";
        case 100000000000:
            return "100G";
        case 200000000000:
            return "200G";
        case 400000000000:
            return "400G";
        default:
            return "";
    }
};

const parseReason = (reason) => {
    if (reason?.indexOf("port-err-") === 0) {
        return reason.split("-")[2];
    }
    return reason;
};

const main = async () => {
    // wait 5 seconds
    await delay(5000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacedetails: connecting to device at ${workerData.address}`);

    const data = {
        fields: "interface-type;oper-status;name;description;speed;admin-status;ether-state/auto-negotiate;ether-state/media-type;intf-ext-state/error-type;intf-ext-state/port-error-reason",
    };

    while (true) {
        const result = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces/interface",
            data: data,
            timeout: parseInt(workerData["timeout"] ? workerData["timeout"] : 5000),
            username: workerData["username"],
            password: workerData["password"],
        });

        for (const eachInterface of result?.["Cisco-IOS-XE-interfaces-oper:interface"]) {
            if (eachInterface["interface-type"] === "iana-iftype-ethernet-csmacd") {
                const operStatus =
                    eachInterface?.["intf-ext-state"]?.["error-type"] === "port-error-disable"
                        ? "err-disable"
                        : eachInterface["oper-status"];
                await interfacesCollection.updateOne(
                    { interfaceId: eachInterface["name"] },
                    {
                        $set: {
                            description: eachInterface["description"],
                            "oper-status": operStatus,
                            "admin-status": eachInterface["admin-status"],
                            "admin-speed": convertPortSpeed(parseInt(eachInterface["speed"])),
                            "auto-negotiate": eachInterface["ether-state"]?.["auto-negotiate"],
                            "media-type": eachInterface["ether-state"]?.["media-type"],
                            "error-reason": parseReason(eachInterface?.["intf-ext-state"]?.["port-error-reason"]),
                        },
                    },
                    { upsert: false }
                );
            }
        }

        // wait 2 seconds
        await delay(2000);
    }
};

main();
