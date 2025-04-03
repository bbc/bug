"use strict";

const delay = require("delay");
const formatBps = require("@core/format-bps");
const trafficSaveHistory = require("../services/traffic-savehistory");


const parseSpeed = (speed) => {
    const speeds = {
        2: "100M",
        3: "100M",
        4: "10M",
        5: "10M",
        6: "100M",
        7: "1G",
        8: "10G",
        9: "20G",
        10: "40G",
        11: "25G",
        12: "50G",
        13: "100G",
    }
    return speeds?.[speed] ?? "";
}

module.exports = async (NetgearApi, interfacesCollection, historyCollection) => {

    // get list of interfaces
    const interfaces = await interfacesCollection.find().toArray();

    if (!interfaces) {
        console.log("worker-interfacestats: no interfaces found in db - waiting ...");
        await delay(4000);
    } else {
        // get stats from device API ...


        const result = await NetgearApi.get({ path: "sw_portstats?portid=ALL" });

        // do this now - in case updating the DB takes a while ...
        const sampleDate = new Date();
        const historyArray = [];

        for (let eachInterface of interfaces) {

            const interfaceResultFromApi = result?.switchStatsPort?.find((p) => p.portId === eachInterface.port);
            if (interfaceResultFromApi) {
                // we create a new object, and use $set in mongo, so we don't overwrite the main interface worker results
                const fieldsToUpdate = {};

                fieldsToUpdate["adminMode"] = interfaceResultFromApi["adminMode"];
                fieldsToUpdate["status"] = interfaceResultFromApi["status"];
                // fieldsToUpdate["vlanMode"] = interfaceResultFromApi["mode"];
                // fieldsToUpdate["vlans"] = interfaceResultFromApi["vlans"];
                fieldsToUpdate["speed"] = interfaceResultFromApi["speed"];
                fieldsToUpdate["stpPortState"] = interfaceResultFromApi["portState"];
                fieldsToUpdate["oprState"] = interfaceResultFromApi["oprState"];
                fieldsToUpdate["stpStatus"] = interfaceResultFromApi["stpStatus"];

                fieldsToUpdate["bandwidthText"] = parseSpeed(interfaceResultFromApi["speed"]);
                fieldsToUpdate["autoNegotiateActive"] = interfaceResultFromApi["duplex"] === 65535;

                let rxRate = parseFloat(interfaceResultFromApi["rxMbps"]) * 1024 * 1024;
                let txRate = parseFloat(interfaceResultFromApi["txMbps"]) * 1024 * 1024;

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
                    id: eachInterface.port,
                    "tx-rate": txRate,
                    "rx-rate": rxRate,
                });

                // save back to database
                await interfacesCollection.updateOne(
                    {
                        port: eachInterface.port,
                    },
                    { $set: fieldsToUpdate }
                );

            }
        }

        // save history
        await trafficSaveHistory(historyCollection, historyArray);

    }
};

