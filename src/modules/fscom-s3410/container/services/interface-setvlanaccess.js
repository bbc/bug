"use strict";

const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, untaggedVlan = "1") => {
    const config = await configGet();

    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: config.address,
        community: config.snmpCommunity,
    });

    console.log(`interface-setvlanaccess: setting interface ${interfaceId} to access vlan ${untaggedVlan} ...`);

    const result = await snmpAwait.set({
        oid: `1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.3.${interfaceId}`,
        value: parseInt(untaggedVlan),
    });

    // we're done with the SNMP session
    snmpAwait.close();

    console.log(result);
    // if (result) {
    //     console.log(`interface-rename: success - updating DB`);
    //     try {
    //         const interfacesCollection = await mongoCollection("interfaces");
    //         const dbResult = await interfacesCollection.updateOne(
    //             { interfaceId: parseInt(interfaceId) },
    //             { $set: { alias: newName } }
    //         );
    //         console.log(`interface-rename: ${JSON.stringify(dbResult.result)}`);
    //         return true;
    //     } catch (error) {
    //         console.log(`interface-rename: failed to update db`);
    //         console.log(error);
    //         return false;
    //     }
    // }
    // console.log(`interface-rename: failed to rename interface ${interfaceId} to ${newName}`);
    // return false;
};
