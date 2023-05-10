"use strict";

const appearXApi = require("@utils/appearx-api");
const configGet = require("@core/config-get");

module.exports = async (encoderService) => {
    try {
        const config = await configGet();
        if (!config) {
            return false;
        }

        // connect to API
        const XApi = new appearXApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        if (await XApi.connect()) {
            // post value to device
            return await XApi.post({
                path: "mmi/service_encoderpool/api/jsonrpc",
                method: "Xger:2.31/coderService/SetCoderServices",
                params: {
                    data: [encoderService],
                },
                id: "SetEncoderServices",
            });
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};
