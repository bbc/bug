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
                enabled: false,
            },
        },
        timeout: config["timeout"],
        username: config["username"],
        password: config["password"],
    });
    if (result) {
        console.log(`interface-disable: success - updating DB`);
        try {
            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: interfaceId },
                { $set: { "admin-status": "if-state-down" } }
            );
            console.log(`interface-disable: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-disable: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-disable: failed to disable interface ${interfaceId} to ${newName}`);
    return false;
};
