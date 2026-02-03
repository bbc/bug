"use strict";

const register = require("module-alias/register");
const aristaApi = require("@utils/arista-api");
const mongoSingle = require("@core/mongo-single");
const delay = require("delay");

module.exports = async (config) => {

    // get temperature from device
    const result = await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["show system environment temperature"],
    });

    // get main system sensors
    const temps = result.tempSensors.map(sensor => ({
        name: sensor.name,
        description: sensor.description,
        current: sensor.currentTemperature,
        target: sensor.targetTemperature,
        overheat: sensor.overheatThreshold,
        critical: sensor.criticalThreshold,
        hwStatus: sensor.hwStatus,
        inAlert: sensor.inAlertState,
        type: "system"
    }));

    // optionally include PSU sensors
    const psuTemps = [];
    if (Array.isArray(result.powerSupplySlots)) {
        for (const slot of result.powerSupplySlots) {
            for (const sensor of slot.tempSensors) {
                psuTemps.push({
                    name: sensor.name,
                    description: sensor.description,
                    current: sensor.currentTemperature ?? null,
                    target: sensor.targetTemperature,
                    overheat: sensor.overheatThreshold,
                    critical: sensor.criticalThreshold,
                    hwStatus: sensor.hwStatus,
                    inAlert: sensor.inAlertState,
                    type: "cpu"
                });
            }
        }
    }

    const allTemps = temps.concat(psuTemps);
    await mongoSingle.set("temperature", allTemps, 120);
    console.log(`arista-fetchtemperature: fetched readings for ${allTemps.length} temperature sensor(s)`);
    return allTemps;
};
