"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {
    let interfacesCollection;

    try {
        // get interfaces collection
        interfacesCollection = await mongoCollection("interfaces");

        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();
        if (!interfaces || !interfaces.length) {
            console.log("arista-fetchinterfacepoe: no interfaces found in db - waiting ...");
            await delay(5000);
            return;
        }

        console.log(`arista-fetchinterfacepoe: fetching poe details from ${config.address} ...`);

        // get poe details from device
        const result = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "configure", "show poe"],
        });

        const poePorts = result.find(r => r?.poePorts)?.poePorts;
        if (!poePorts) {
            console.log("arista-fetchinterfacepoe: no poe data returned from device");
            return;
        }

        // prepare bulk update operations
        const ops = Object.entries(poePorts).map(([ifName, port]) => ({
            updateOne: {
                filter: { interfaceId: ifName },
                update: {
                    $set: {
                        poe: {
                            present: port.portPresent,
                            enabled: port.pseEnabled,
                            state: port.portState,
                            power: port.power,
                            voltage: port.voltage,
                            current: port.current,
                            temperature: port.temperature,
                            priority: port.portPriority,
                        },
                    },
                },
                upsert: false,
            },
        }));

        if (!ops.length) {
            console.log("arista-fetchinterfacepoe: no poe updates to write");
            return;
        }

        // update db
        const bulkResult = await interfacesCollection.bulkWrite(ops);
        console.log(`arista-fetchinterfacepoe: updated db with poe details for ${bulkResult.modifiedCount} interface(s)`);

    } catch (err) {
        console.error(`arista-fetchinterfacepoe failed: ${err.message}`);
        throw err;
    }
};
