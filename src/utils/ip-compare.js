"use strict";

const logger = require("@utils/logger")(module);
const ipClean = require("@utils/ip-clean");
const cidrRegex = require("cidr-regex");
const ipRangeCheck = require("ip-range-check");

module.exports = async (source, ranges) => {
    const cleanedSource = await ipClean(source);

    //If no IP ranges are provided, then we just return true
    if (!ranges || ranges.length === 0) {
        return true;
    }

    for (let range of ranges) {
        const validRange = await cidrRegex({ exact: true }).test(range);
        if (validRange) {
            if (await ipRangeCheck(cleanedSource, range)) {
                return true;
            }
        } else {
            logger.warning(`${range} is not a valid CIDR notation range`);
        }
    }

    return false;
};
