"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

module.exports = async (interfaceId, untaggedVlan = 1, taggedVlans = []) => {
    const config = await configGet();

    // fetch interface details
    const interfacesCollection = await mongoCollection("interfaces");
    const dbInterface = await interfacesCollection.findOne({ interfaceId: interfaceId });
    if (!dbInterface) {
        console.log(`interface-setvlantrunk: interface ${interfaceId} not found`);
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
                            trunk: {},
                        },
                        "Cisco-IOS-XE-switch:nonegotiate": [null],
                        "Cisco-IOS-XE-switch:trunk": {
                            allowed: {
                                vlan: {
                                    vlans: taggedVlans.join(","),
                                },
                            },
                            native: {
                                vlan: {
                                    "vlan-id": untaggedVlan,
                                },
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
        console.log(`interface-setvlantrunk: success - updating DB`);
        try {
            // update db
            const dbResult = await interfacesCollection.updateOne(
                { interfaceId: interfaceId },
                { $set: { "untagged-vlan": parseInt(untaggedVlan), "tagged-vlans": taggedVlans } }
            );
            console.log(`interface-setvlantrunk: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-setvlantrunk: failed to update db`);
            console.log(error);
            return false;
        }
    }
    console.log(`interface-setvlantrunk: failed to set vlan ${untaggedVlan} on interface ${interfaceId}`);
    return false;
};
