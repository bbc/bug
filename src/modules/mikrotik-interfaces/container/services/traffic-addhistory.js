"use strict";
const maxLength = 20;

module.exports = async (trafficCollection, trafficArray) => {
    let existingTrafficArray = await trafficCollection.find().toArray();
    if (!existingTrafficArray) {
        existingTrafficArray = [];
    }

    for (let eachTraffic of trafficArray) {
        // search previous
        const existingTraffic = existingTrafficArray.find((o) => o.name === eachTraffic.name) ?? null;

        if (!existingTraffic) {
            eachTraffic["tx-history"] = new Array(maxLength).fill(0);
            eachTraffic["rx-history"] = new Array(maxLength).fill(0);
        } else {
            eachTraffic["tx-history"] = existingTraffic["tx-history"];
            eachTraffic["rx-history"] = existingTraffic["rx-history"];
        }

        // add them on
        eachTraffic["tx-history"].push({ timestamp: eachTraffic.timestamp, value: eachTraffic["tx-bits-per-second"] });
        eachTraffic["rx-history"].push({ timestamp: eachTraffic.timestamp, value: eachTraffic["rx-bits-per-second"] });

        // check the length
        eachTraffic["tx-history"].splice(0, eachTraffic["tx-history"].length - maxLength);
        eachTraffic["rx-history"].splice(0, eachTraffic["rx-history"].length - maxLength);
    }
    return trafficArray;
};
