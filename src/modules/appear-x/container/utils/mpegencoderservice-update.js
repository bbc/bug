"use strict";

const appearXApi = require("@utils/appearx-api");
const configGet = require("@core/config-get");
const dbItemUpdate = require("@utils/dbitem-update");

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
            console.log(`mpegencoderservice-update: updating service id ${encoderService.key}`);
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
        console.log(JSON.stringify(encoderService, null, 2));
        return false;
    }
};
