"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");

module.exports = async (sid) => {
    try {
        const tokenCollection = await mongoCollection("token");
        const token = await tokenCollection.findOne();
        const config = await configGet();

        const response = await axios.post(
            `https://api-core.teradek.com/api/v1.0/${config?.organisation}/devices/${sid}/reboot?auth_token=${token?.auth_token}`
        );

        if (response.data?.meta?.status === "ok") {
            console.log(`device-reboot: rebooted ${sid}.`);
            return true;
        } else {
            console.log(`device-reboot: could not reboot ${sid}.`);
            console.log(response.data);
            return false;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};
