"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

module.exports = async (interfaceId, newName) => {
    const config = await configGet();

    // fetch interface details
    const interfacesCollection = await mongoCollection("interfaces");
    const dbInterface = await interfacesCollection.findOne({ interfaceId: interfaceId });
    if (!dbInterface) {
        console.log(`interface-rename: interface ${interfaceId} not found`);
        return false;
    }
    const result = await ciscoIOSXEApi.update({
        host: config["address"],
        path: `/restconf/data/Cisco-IOS-XE-native:native/interface/${dbInterface.type}=${encodeURIComponent(
            dbInterface.portIndex
        )}`,
        data: {
            [dbInterface.type]: {
                description: newName,
            },
        },
        timeout: 5000,
        username: config["username"],
        password: config["password"],
    });
    if (result) {
        console.log(`interface-rename: success - updating DB`);
        try {
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: interfaceId },
                { $set: { description: newName } }
            );
            console.log(`interface-rename: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-rename: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-rename: failed to rename interface ${interfaceId} to ${newName}`);
    return false;
};
