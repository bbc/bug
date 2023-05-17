"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    // fetch info
    const ipInterfaces = await mongoSingle.get("ipInterfaces");

    return (
        ipInterfaces &&
        ipInterfaces.map((i) => {
            return {
                id: i.key,
                isManagementActive: i.value.isManagementActive,
                label: i.value.label,
                name: i.value.name,
                ipv4address: i.value.ipv4.ipAddress,
            };
        })
    );
};
