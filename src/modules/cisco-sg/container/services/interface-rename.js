"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, newName) => {
    const config = await configGet();

    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: config.address,
        community: config.snmpCommunity,
    });

    console.log(`interface-rename: renaming interface ${interfaceId} to ${newName} ...`);

    const result = await snmpAwait.set({
        oid: `.1.3.6.1.2.1.31.1.1.1.18.${interfaceId}`,
        value: newName.toString(),
    });

    // we're done with the SNMP session
    snmpAwait.close();

    if (result) {
        console.log(`interface-rename: success - updating DB`);
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: parseInt(interfaceId) },
                { $set: { alias: newName } }
            );
            console.log(`interface-rename: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-disable: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-rename: failed to rename interface ${interfaceId} to ${newName}`);
    return false;
};
