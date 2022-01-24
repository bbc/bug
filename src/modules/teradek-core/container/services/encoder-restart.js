"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");

module.exports = async (sid) => {
    const tokenCollection = await mongoCollection("token");
    const token = await tokenCollection.findOne();
    const config = await configGet();

    const response = await axios.get(
        `https://api-core.teradek.com/api/v1.0/${config?.organisation}/devices/${sid}/restart-encoder`,
        {
            params: {
                auth_token: token?.auth_token,
            },
        }
    );

    if (response.data?.meta?.status === "ok") {
        console.log(`encoder-restart: restarted ${sid}.`);
        return true;
    } else {
        console.log(response.data);
        throw new Error();
    }
};
