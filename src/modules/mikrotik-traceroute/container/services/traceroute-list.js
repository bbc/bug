"use strict";

const mongoCollection = require("@core/mongo-collection");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    const tracerouteCollection = await mongoCollection("traceroute");
    let traceroute = await tracerouteCollection.find().toArray();

    for (let i in traceroute) {
        traceroute[i] = { ...traceroute[i], ...config.traceroutes[traceroute[i].tracerouteId] };
    }

    if (!traceroute) {
        return [];
    }

    return traceroute;
};
