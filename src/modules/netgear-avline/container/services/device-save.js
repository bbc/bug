"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const netgearApi = require("@utils/netgear-api");

module.exports = async (port, newName) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const NetgearApi = new netgearApi({
        host: config.address,
        username: config.username,
        password: config.password,
    });

    console.log(`device-save: saving config ...`);

    // save the config
    const result = await NetgearApi.post({ path: `config_copy?directive=rtos` });
    console.log(result?.resp?.status);

    return result?.resp?.status === "success"
};
