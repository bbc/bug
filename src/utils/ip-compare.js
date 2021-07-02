"use strict";

const logger = require("@utils/logger")(module);
const cidrRegex = require("cidr-regex");
const ipRangeCheck = require("ip-range-check");

module.exports = async (source, ranges) => {
    for (let range in ranges) {
        const validRange = await cidrRegex({ exact: true }).test(range);
        if (validRange) {
            return ipRangeCheck(source, range);
        }
        logger.warning(`${range} is not a valid CIDR notation range`);
    }
};
