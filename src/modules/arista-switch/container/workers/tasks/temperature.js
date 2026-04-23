"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ aristaApi, mongoSingle, workerData }) => {
    try {
        // fetch temperature from device
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show system environment temperature"],
        });

        if (!result) {
            logger.info("no temperature data returned from device");
            return;
        }

        // get main system sensors
        const temps = (result.tempSensors || []).map(sensor => ({
            name: sensor.name,
            description: sensor.description,
            current: sensor.currentTemperature,
            target: sensor.targetTemperature,
            overheat: sensor.overheatThreshold,
            critical: sensor.criticalThreshold,
            hwStatus: sensor.hwStatus,
            inAlert: sensor.inAlertState,
            type: "system",
        }));

        // optionally include PSU sensors
        const psuTemps = [];
        if (Array.isArray(result.powerSupplySlots)) {
            for (const slot of result.powerSupplySlots) {
                for (const sensor of slot.tempSensors || []) {
                    psuTemps.push({
                        name: sensor.name,
                        description: sensor.description,
                        current: sensor.currentTemperature ?? null,
                        target: sensor.targetTemperature,
                        overheat: sensor.overheatThreshold,
                        critical: sensor.criticalThreshold,
                        hwStatus: sensor.hwStatus,
                        inAlert: sensor.inAlertState,
                        type: "cpu",
                    });
                }
            }
        }

        const allTemps = temps.concat(psuTemps);

        // save readings to db
        await mongoSingle.set("temperature", allTemps, 120);

        logger.info(`fetched readings for ${allTemps.length} temperature sensor(s)`);

        return allTemps;

    } catch (err) {
        logger.error(`arista-fetchtemperature failed: ${err.message}`);
        throw err;
    }
};
