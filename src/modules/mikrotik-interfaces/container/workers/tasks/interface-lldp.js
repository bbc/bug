"use strict";

const logger = require("@core/logger")(module);
const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ routerOsApi, interfacesCollection }) => {
    try {
        const data = await routerOsApi.run("/ip/neighbor/print");

        // process data
        const lldpItems = [];
        for (let i in data) {
            lldpItems.push(
                mikrotikParseResults({
                    result: data[i],
                    arrayFields: ["interface"],
                    integerFields: [],
                    booleanFields: [],
                    timeFields: ["uptime"],
                })
            );
        }

        // group by interface
        const lldpByInterface = {};
        for (let eachEntry of lldpItems) {
            // clone and tidy up a few fields we don't need
            const eachEntryClone = Object.assign({}, eachEntry);
            delete eachEntryClone?.interface;
            delete eachEntryClone?.id;
            delete eachEntryClone?.unpack;
            delete eachEntryClone?.["system-caps"];
            delete eachEntryClone?.["system-caps-enabled"];

            for (let eachInterface of eachEntry?.interface) {
                if (lldpByInterface[eachInterface] === undefined) {
                    lldpByInterface[eachInterface] = [];
                }
                lldpByInterface[eachInterface].push(eachEntryClone);
            }
        }

        const activeInterfaceNames = Object.keys(lldpByInterface);
        const clearFilter = {
            lldp: { $exists: true },
        };

        if (activeInterfaceNames.length) {
            clearFilter["default-name"] = { $nin: activeInterfaceNames };
        }

        const operations = [
            {
                updateMany: {
                    filter: clearFilter,
                    update: {
                        $unset: {
                            lldp: "",
                        },
                    },
                },
            },
        ];

        for (let [interfaceName, lldpObject] of Object.entries(lldpByInterface)) {
            operations.push({
                updateOne: {
                    filter: { "default-name": interfaceName },
                    update: {
                        $set: {
                            lldp: lldpObject,
                        },
                    },
                    upsert: false,
                },
            });
        }

        await interfacesCollection.bulkWrite(operations, { ordered: false });
        logger.debug(`found ${Object.entries(lldpByInterface).length} interface(s) with LLDP data - saved to db`);
    } catch (error) {
        logger.error(error.stack || error.message);
        throw error;
    }
};
