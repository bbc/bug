"use strict";

const ciscoSGSNMP = require("@utils/ciscosg-snmp");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId) => {
    const config = await configGet();

    const result = await ciscoSGSNMP.setInt({
        host: config.address,
        community: config.snmp_community,
        oid: `1.3.6.1.2.1.2.2.1.7.${interfaceId}`,
        value: 2,
    });

    if (result) {
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            await interfacesCollection.updateOne(
                { interfaceId: parseInt(interfaceId) },
                { $set: { "admin-state": false } }
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};