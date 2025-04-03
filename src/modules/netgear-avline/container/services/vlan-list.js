"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const vlans = await mongoSingle.get("vlans");
    return (
        vlans &&
        vlans.map((vlan) => ({
            id: vlan.id,
            label: vlan.name,
        }))
    );
};
