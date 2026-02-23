"use strict";

const logger = require("@core/logger")(module);

module.exports = function getSrcAddress(route, dbAddresses, dbRules) {
    let address = null;
    const ruleAddresses = dbRules.map((r) => r["src-address"]) || [];

    if (!route.static) {
        // dynamic route: usually just one address on the bridge
        const addressObj = dbAddresses.filter(
            a => a.interface === route._bridgeName && !a.comment?.includes("loopback")
        );

        if (!addressObj || addressObj.length === 0) {
            logger.warning(`srcaddress: no matching address found for dynamic route ${route._bridgeName}`);
            return null;
        }
        if (addressObj.length > 1) {
            logger.warning(`srcaddress: multiple addresses found for dynamic route ${route._bridgeName}`);
            return null;
        }

        address = addressObj[0].address;
        logger.debug(`srcaddress: found address ${address} for dynamic route ${route._bridgeName}`);

    } else {
        // static route: find a rule that matches an address on the bridge
        const bridgeAddresses = dbAddresses.filter(addr => addr.interface === route._bridgeName);
        address = bridgeAddresses.find(addr => !ruleAddresses.includes(addr.address)).address;
    }

    // strip CIDR if present
    if (address && address.includes('/')) {
        address = address.split('/')[0];
    }

    return address;
}
