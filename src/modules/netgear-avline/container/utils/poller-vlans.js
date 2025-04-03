"use strict";

const delay = require("delay");
const mongoSingle = require("@core/mongo-single");

module.exports = async (NetgearApi) => {

    const vlans = [];

    // fetch VLAN info from device
    const result = await NetgearApi.get({ path: "snooping_vlan?family=igmp" });
    if (result) {
        for (let eachVlan of result?.snooping_vlans) {
            const vlanResult = await NetgearApi.get({ path: `swcfg_vlan?vlanid=${eachVlan.vlanId}` });
            vlans.push({
                id: eachVlan.vlanId,
                name: vlanResult?.switchConfigVlan?.name,
                igmpState: vlanResult?.switchConfigVlan?.igmpConfig?.igmpState,
            });
        }
    }

    // save to db
    await mongoSingle.set("vlans", vlans, 60);

    // wait and loop
    await delay(20400);
};
