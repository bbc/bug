"use strict";

const mikrotikFetchLldp = require("@utils/mikrotik-fetchlldp");
const logger = require("@core/logger")(module);

module.exports = async ({ conn, interfacesCollection }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const lldp = await mikrotikFetchLldp(conn);

        // group by interface
        const lldpByInterface = {};
        for (let eachEntry of lldp) {
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

        for (let [interfaceName, lldpObject] of Object.entries(lldpByInterface)) {
            await interfacesCollection.updateOne(
                { "default-name": interfaceName },
                {
                    $set: {
                        lldp: lldpObject,
                    },
                },
                { upsert: false }
            );
        }
        logger.debug(`interface-lldp: found ${Object.entries(lldpByInterface).length} interface(s) with LLDP data - saved to db`);

    } catch (error) {
        logger.error(`interface-lldp: ${error.message}`);
        throw error;
    }
};

