"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

module.exports = async (interfaceId, untaggedVlan = "1") => {
    const config = await configGet();

    // fetch interface details
    const interfacesCollection = await mongoCollection("interfaces");
    const dbInterface = await interfacesCollection.findOne({ interfaceId: interfaceId });
    if (!dbInterface) {
        console.log(`interface-setvlanaccess: interface ${interfaceId} not found`);
        return false;
    }
    const result = await ciscoIOSXEApi.update({
        host: config["address"],
        path: `/restconf/data/Cisco-IOS-XE-native:native/interface/${dbInterface.type}=${encodeURIComponent(
            dbInterface.portIndex
        )}`,
        data: {
            [dbInterface.type]: {
                "switchport-config": {
                    switchport: {
                        "Cisco-IOS-XE-switch:mode": {
                            access: {},
                        },
                        "Cisco-IOS-XE-switch:access": {
                            vlan: {
                                vlan: parseInt(untaggedVlan),
                            },
                        },
                    },
                },
            },
        },
        timeout: config["timeout"],
        username: config["username"],
        password: config["password"],
    });
    if (result) {
        console.log(`interface-setvlanaccess: success - updating DB`);
        try {
            // update db
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: interfaceId },
                { $set: { "untagged-vlan": parseInt(untaggedVlan), "tagged-vlans": [] } }
            );
            console.log(`interface-setvlanaccess: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-setvlanaccess: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-setvlanaccess: failed to set vlan ${untaggedVlan} on interface ${interfaceId}`);
    return false;
};
