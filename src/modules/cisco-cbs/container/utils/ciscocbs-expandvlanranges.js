"use strict";

module.exports = (vlans, availableVlans) => {
    if (vlans === "ALL" || vlans === "1-4094") {
        return availableVlans;
    }

    if (Array.isArray(vlans) && (vlans.includes("ALL") || vlans.includes("1-4094"))) {
        return availableVlans;
    }
    return vlans;
};
