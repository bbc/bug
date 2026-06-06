"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (interfaceName) => {
    try {
        const dbInterfaces = await mongoCollection("interfaces");
        let iface = await dbInterfaces.findOne({ name: interfaceName });

        if (!iface) {
            return null;
        }

        return iface?.lldp.sort((a, b) => a?.identity?.localeCompare(b?.identity, "en", { sensitivity: "base" }));
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
