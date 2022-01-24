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
            `https://api-core.teradek.com/api/v1.0/${config?.organisation}/devices/${sid}/resume-stream`,
            {
                params: {
                    auth_token: token?.auth_token,
                },
            }
        );

        if (response.data?.meta?.status === "ok") {
            console.log(`encoder-start: started encoder ${sid}`);
            return await deviceUpdateLocal(sid, "streamStatus", "streaming");
        } else {
            console.log(`encoder-start: failed to start encoder ${sid}`);
            console.log(response.data);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};
