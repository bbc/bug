"use strict";

const mongoSingle = require("@core/mongo-single");
const delay = require("delay");

module.exports = async (NetgearApi, interfacesCollection) => {

    const vlans = await mongoSingle.get("vlans");
    const availableVlans = vlans.map((v) => v.id);

    // get list of interfaces
    const interfaces = await interfacesCollection.find().toArray();

    for (let eachInterface of interfaces) {
        const fieldsToUpdate = {};

        const result = await NetgearApi.get({ path: `dot1q_sw_port_config?interface=${eachInterface.port}` });
        if (result?.dot1q_sw_port_config) {

            fieldsToUpdate["configMode"] = result.dot1q_sw_port_config.configMode

            if (result.dot1q_sw_port_config.configMode === "access") {
                fieldsToUpdate["untagged-vlan"] = result.dot1q_sw_port_config?.accessVlan;
                fieldsToUpdate["tagged-vlans"] = [];
            }
            else if (result.dot1q_sw_port_config.configMode === "trunk") {
                fieldsToUpdate["untagged-vlan"] = result.dot1q_sw_port_config?.nativeVlan;
                fieldsToUpdate["tagged-vlans"] = result.dot1q_sw_port_config?.allowedVlanList?.filter((v) => availableVlans.includes(parseInt(v))).map((v) => parseInt(v));
            }
            else if (result.dot1q_sw_port_config.configMode === "general") {
                fieldsToUpdate["untagged-vlan"] = result.dot1q_sw_port_config?.nativeVlan;
                fieldsToUpdate["tagged-vlans"] = result.dot1q_sw_port_config?.allowedVlanList?.filter((v) => availableVlans.includes(parseInt(v))).map((v) => parseInt(v));
            }

        }

        // save to DB
        await interfacesCollection.updateOne(
            {
                interfaceId: eachInterface.interfaceId,
            },
            { $set: fieldsToUpdate }
        );

        await delay(5000);

    }
}
