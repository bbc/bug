"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ mongoSingle, snmpAwait }) => {
    try {
        const vlanResults = await snmpAwait.subtreeNext({
            oid: ".1.3.6.1.2.1.17.7.1.4.3.1.1",
            maxIndexExclusive: 4101,
        });

        if (vlanResults) {
            const vlans = [];

            // Some switches omit default VLAN from the result, so add it when needed.
            if (vlanResults["1.3.6.1.2.1.17.7.1.4.3.1.1.1"] === undefined) {
                vlans.push({ id: 1, label: "Default" });
            }

            for (let [eachOid, eachResult] of Object.entries(vlanResults)) {
                const vlan = eachOid.substring(eachOid.lastIndexOf(".") + 1);
                if (!eachResult) {
                    eachResult = `VLAN_${vlan}`;
                }

                vlans.push({
                    id: parseInt(vlan, 10),
                    label: eachResult,
                });
            }

            logger.debug(`updating db with ${vlans.length} vlan(s)`);
            await mongoSingle.set("vlans", vlans, 1800);
        }
    } catch (err) {
        logger.warning(`vlans task failed: ${err.stack || err.message || err}`);
        return;
    }
};