"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {

    const interfacesCollection = await mongoCollection("interfaces");

    // get list of interfaces
    const interfaces = await interfacesCollection.find().toArray();

    if (!interfaces) {
        console.log("arista-fetchinterfacepoe: no interfaces found in db - waiting ...");
        await delay(5000);
    } else {
        // get details from device
        const result = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "configure", "show poe"],
        });

        const poePorts = result.find(r => r?.poePorts).poePorts;
        if (!poePorts) {
            return;
        }


        const mappedPoePorts = Object.entries(poePorts).map(([ifName, port]) => ({
            name: ifName,
            present: port.portPresent,
            enabled: port.pseEnabled,
            state: port.portState,
            power: port.power,
            voltage: port.voltage,
            current: port.current,
            temperature: port.temperature,
            priority: port.portPriority,
        }));


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

        if (ops.length) {
            await interfacesCollection.bulkWrite(ops);
            console.log(`arista-fetchinterfacepoe: updated db with poe details for ${ops.length} interface(s)`);
            await delay(500000);
        }

    }
};
