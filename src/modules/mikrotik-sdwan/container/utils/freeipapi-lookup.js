const axios = require('axios');
const mongoCollection = require("@core/mongo-collection");

module.exports = async (ipAddress) => {
    const geoIpCollection = await mongoCollection("geoip");

    const cached = await geoIpCollection.findOne({ _id: ipAddress });

    if (cached) {
        return cached.data;
    }

    const url = `https://free.freeipapi.com/api/json/${ipAddress}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
        throw new Error(
            `Failed to fetch geoip data for ${ipAddress}: ${response.statusText}`
        );
    }

    const data = response.data;

    const mobileAsns = ["telefonica", "vodafone", "three", "ee", "o2"];
    const asnOrg = (data.asnOrganization || "").toLowerCase();
    data._isCgnat = mobileAsns.some((m) => asnOrg.includes(m));

    await geoIpCollection.updateOne(
        { _id: ipAddress },
        {
            $set: {
                data,
                timestamp: new Date()
            }
        },
        { upsert: true }
    );

    return data;
};