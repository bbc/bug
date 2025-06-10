"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const netgearApi = require("@utils/netgear-api");
const netgearExpandVlanRanges = require("@utils/netgear-expandvlanranges");
const mongoSingle = require("@core/mongo-single");

module.exports = async (port, untaggedVlan = 1, taggedVlans = []) => {
    const config = await configGet();

    // fetch available VLANs from db
    const availableVlansArray = await mongoSingle.get("vlans");
    const availableVlans = availableVlansArray?.map((v) => v.id);
    if (!availableVlans || availableVlans.length === 0) {
        console.log(`interface-setvlantrunk: no available vlans found`);
        return false;
    }

    // expand any ranges like this: ['1-201'] to this [1,20,101,201] using configured available vlans
    let expandedVlans = netgearExpandVlanRanges(taggedVlans, availableVlans);
    if (!expandedVlans.includes(parseInt(untaggedVlan))) {
        console.log(expandedVlans);
        expandedVlans.push(parseInt(untaggedVlan));
        console.log(expandedVlans);
    }

    expandedVlans.sort((a, b) => a - b);

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

    console.log(`interface-setvlantrunk: setting vlan ${untaggedVlan} on interface ${port}`);

    // fetch existing config
    const portConfig = await NetgearApi.get({ path: `dot1q_sw_port_config?interface=${port}` });

    // pull out the keys we need
    const newConfig = {
        dot1q_sw_port_config: {
            accessVlan: untaggedVlan,
            allowedVlanList: expandedVlans,
            configMode: "general",
            nativeVlan: untaggedVlan,
        }
    }

    // save it back
    const result = await NetgearApi.post({ path: `dot1q_sw_port_config?interface=${port}`, params: newConfig });

    if (result?.resp?.status === "success") {
        console.log(`interface-setvlantrunk: success - updating DB`);
        // update db
        try {

            // in the db we only want vlans which are configured on the switch. Grumble grumble.
            const filteredVlans = expandedVlans?.filter((v) => availableVlans.includes(parseInt(v))).map((v) => parseInt(v));

            const interfacesCollection = await mongoCollection("interfaces");
            const dbResult = await interfacesCollection.updateOne(
                { port: parseInt(port) },
                { $set: { "tagged-vlans": filteredVlans, configMode: "general", "untagged-vlan": untaggedVlan } }
            );
            console.log(`interface-setvlantrunk: ${JSON.stringify(dbResult.result)}`);
            return true;
        } catch (error) {
            console.log(`interface-setvlantrunk: failed to update db`);
            console.log(error);
            return false;
        }
    }
    return false;
};
