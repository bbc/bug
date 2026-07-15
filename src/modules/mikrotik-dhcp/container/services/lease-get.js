"use strict";

const mongoCollection = require("@core/mongo-collection");
const ouiData = require("oui-data");
const logger = require("@core/logger")(module);

const getOuiPrefix = (macAddress = "") => macAddress.replace(/[^a-fA-F0-9]/g, "").slice(0, 6).toUpperCase();

module.exports = async (leaseId) => {
    try {
        const dbLeases = await mongoCollection("leases");
        let lease = await dbLeases.findOne({ "id": leaseId });

        // set manufacturer
        lease["manufacturer"] = "";
        if (lease["mac-address"]) {
            const ouiPrefix = getOuiPrefix(lease["mac-address"]);
            const manufacturerResult = ouiData[ouiPrefix];
            if (manufacturerResult) {
                lease["manufacturer"] = manufacturerResult.split("\n")[0];
            }
        }

        return lease;
    } catch (err) {
        err.message = err.stack || err.message;
        logger.error(err.message);
        throw err;
    }

};
