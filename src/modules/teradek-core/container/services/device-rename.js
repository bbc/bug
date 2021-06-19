"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");

module.exports = async (sid, name) => {
    try {
        const tokenCollection = await mongoCollection("token");
        const token = await tokenCollection.findOne();
        const config = await configGet();

        const response = await axios.put(
            `https://api-core.teradek.com/api/v1.0/${config?.organisation}/devices/${sid}/customName`,
            {
                params: {
                    auth_token: token?.auth_token,
                },
                name,
            }
        );

        if (response.data?.meta?.status === "ok") {
            return {
                status: "success",
                data: `Renamed ${sid} to '${name}'.`,
            };
        } else {
            return {
                error: `Could not rename ${sid} to '${name}'.`,
                status: "error",
                data: response.data,
            };
        }
    } catch (error) {
        return null;
    }
};
