"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

module.exports = async (interfaceId) => {
    const config = await configGet();

    const result = await ciscoIOSXEApi.update({
        host: config["address"],
        path: `/restconf/data/ietf-interfaces:interfaces/interface=${encodeURIComponent(interfaceId)}`,
        data: {
            "ietf-interfaces:interface": {
                enabled: true,
            },
        },
        timeout: 5000,
        username: config["username"],
        password: config["password"],
    });
    if (result) {
        console.log(`interface-enable: success - updating DB`);
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: interfaceId },
                { $set: { "admin-status": "if-state-up" } }
            );
            console.log(`interface-enable: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-enable: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-enable: failed to enable interface ${interfaceId} to ${newName}`);
    return false;
};
