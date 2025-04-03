"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const netgearApi = require("@utils/netgear-api");

module.exports = async (port, untaggedVlan = "1") => {
    const config = await configGet();

    const interfaceCollection = await mongoCollection("interfaces");
    const iface = await interfaceCollection.findOne({ port: parseInt(port) });
    if (!iface) {
        throw new Error(`interface ${port} not found`);
    }
    console.log(`interface-setvlanaccess: interface ${port} found in db`);

    const NetgearApi = new netgearApi({
        host: config.address,
        username: config.username,
        password: config.password,
    });

    console.log(`interface-setvlanaccess: setting vlan ${untaggedVlan} on interface ${port}`);

    const newConfig = {
        dot1q_sw_port_config: {
            accessVlan: parseInt(untaggedVlan),
            allowedVlanList: [1],
            configMode: "access",
            nativeVlan: 1,
        }
    }

    // save it back
    const result = await NetgearApi.post({ path: `dot1q_sw_port_config?interface=${port}`, params: newConfig });

    if (result?.resp?.status === "success") {
        console.log(`interface-setvlanaccess: success - updating DB`);
        // update db
        try {

            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { port: parseInt(port) },
                { $set: { "tagged-vlans": [], configMode: "access", "untagged-vlan": parseInt(untaggedVlan) } }
            );
            console.log(`interface-setvlanaccess: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-setvlanaccess: failed to update db`);
            console.log(error);
            return false;
        }
    }
    return true;

};
