"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const vlans = await mongoSingle.get("vlans") ?? [];
        return vlans.map(vlan => ({
            id: vlan.id,
            label: vlan.name,
        }));
    } catch (err) {
        err.message = `vlan-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
