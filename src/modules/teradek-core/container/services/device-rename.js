"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");
const deviceUpdateLocal = require("./device-updatelocal");

module.exports = async (sid, name) => {
    try {
        const tokenCollection = await mongoCollection("token");
        const token = await tokenCollection.findOne();
        const config = await configGet();

        const url = `https://api-core.teradek.com/api/v1.0/${config.organisation}/devices/${sid}/customName?auth_token=${token?.auth_token}`;
        const response = await axios.put(url, name, { headers: { 'Content-Type': 'application/json' } });

        console.log(response.data);

        if (response.data?.meta?.status === "ok") {
            return await deviceUpdateLocal(sid, "customName", name);
        }
    } catch (error) {
        console.log(error);
    }
    return false;
};
