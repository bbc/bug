"use strict";

const register = require("module-alias/register");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {
    try {
        // fetch vlan info from device
        const result = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["show vlan"],
        });

        if (!result?.vlans) {
            console.info("arista-fetchvlans: no vlans returned from device");
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

        console.info(`arista-fetchvlans: saved ${vlans.length} vlan(s) to the db`);

    } catch (err) {
        console.error(`arista-fetchvlans failed: ${err.message}`);
        throw err;
    }
};
