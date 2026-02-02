"use strict";

const register = require("module-alias/register");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {

    const result = await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["show vlan"],
    });

    const vlans = [];
    if (result?.vlans) {
        for (let [vlanId, eachVlan] of Object.entries(result?.vlans)) {
            vlans.push({
                id: parseInt(vlanId),
                name: eachVlan.name,
                dynamic: eachVlan.dynamic,
                status: eachVlan.status,
            });
        }
        await mongoSingle.set("vlans", vlans, 60);
    }
    console.info(`arista-fetchvlans: saved ${vlans.length} vlan(s) to the db`);
};

