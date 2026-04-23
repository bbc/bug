"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ aristaApi, mongoSingle, workerData }) => {

    try {
        // fetch vlan info from device
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show vlan"],
        });

        if (!result?.vlans) {
            logger.info("no vlans returned from device");
            await mongoSingle.set("vlans", [], 60);
            return;
        }

        // transform vlans into db-ready format
        const vlans = Object.entries(result.vlans).map(([vlanId, eachVlan]) => ({
            id: parseInt(vlanId, 10),
            name: eachVlan.name,
            dynamic: eachVlan.dynamic,
            status: eachVlan.status,
        }));

        // save vlans to db
        await mongoSingle.set("vlans", vlans, 60);

        logger.info(`saved ${vlans.length} vlan(s) to the db`);

    } catch (err) {
        logger.error(`failed: ${err.message}`);
        throw err;
    }
};
