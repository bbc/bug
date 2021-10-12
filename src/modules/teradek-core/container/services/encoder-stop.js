"use strict";

const mongoCollection = require("@core/mongo-collection");
const axios = require("axios");
const configGet = require("@core/config-get");
const deviceUpdateLocal = require("./device-updatelocal");

module.exports = async (sid) => {
    try {
        const tokenCollection = await mongoCollection("token");
        const token = await tokenCollection.findOne();
        const config = await configGet();

        const response = await axios.get(
            `https://api-core.teradek.com/api/v1.0/${config?.organisation}/devices/${sid}/pause-stream`,
            {
                params: {
                    auth_token: token?.auth_token,
                },
            }
        );

        if (response.data?.meta?.status === "ok") {
            return await deviceUpdateLocal(sid, "streamStatus", "paused");
        } else {
            console.log(response.data);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};
