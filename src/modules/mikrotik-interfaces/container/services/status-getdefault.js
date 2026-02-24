
'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");
const wildcard = require("wildcard-regex");

module.exports = async () => {

    try {

        const config = await configGet();
        if (!config) {
            return null;
        }

        const dbInterfaces = await mongoCollection("interfaces");
        let interfaces = await dbInterfaces.find().toArray() ?? [];

        // remove excluded interfaces
        if (config.excludedInterfaces) {
            for (let eachFilter of config.excludedInterfaces) {
                const regex = wildcard.wildcardRegExp(eachFilter);

                interfaces = interfaces.filter((iface) => {
                    return !regex.test(iface["name"]);
                });
            }
        }

        return new StatusItem({
            message: `Device active with ${interfaces.length} interface(s) found`,
            key: "defaultservice",
            type: "default",
            flags: [],
        })


    } catch (err) {
        logger.error(`status-getdefault: ${err.stack || err.message}`);
        return [];
    }
};