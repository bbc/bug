"use strict";

const logger = require("@core/logger")(module);

module.exports = function getSrcAddress(route, dbAddresses, dbRules) {
    let address = null;
    const ruleAddresses = dbRules.map((r) => r["src-address"]) || [];

    if (!route.static) {
        // dynamic route: prefer the loopback address when one is configured
        const interfaceAddresses = dbAddresses.filter(
            a => a.interface === route._bridgeName
        );
        const loopbackAddresses = interfaceAddresses.filter(
            a => a.comment?.includes("loopback")
        );
        const addressObj = loopbackAddresses.length > 0
            ? loopbackAddresses
            : interfaceAddresses;

        if (!addressObj || addressObj.length === 0) {
            logger.warning(`No matching address found for dynamic route ${route._bridgeName}`);
            return null;
        }
        if (addressObj.length > 1) {
            logger.warning(`Multiple addresses found for dynamic route ${route._bridgeName}`);
            return null;
        }

        address = addressObj[0].address;
        logger.debug(`Found address ${address} for dynamic route ${route._bridgeName}`);

    } else {
        // static route: find a rule that matches an address on the bridge
        const bridgeAddresses = dbAddresses.filter(addr => addr.interface === route._bridgeName);
        address = bridgeAddresses && bridgeAddresses.find(addr => ruleAddresses.includes(addr?.address))?.address;
    }

    // strip CIDR if present
    if (address && address.includes('/')) {
        address = address.split('/')[0];
    }

    return address;
}
