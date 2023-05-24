"use strict";

const appearXApi = require("@utils/appearx-api");
const configGet = require("@core/config-get");

module.exports = async (testGeneratorProfile) => {
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
            console.log(`mpegencoderservice-update: updating service id ${testGeneratorProfile.key}`);
            // post value to device
            return await XApi.post({
                path: "mmi/service_encoderpool/api/jsonrpc",
                method: "Xger:2.31/testGeneratorProfile/SetTestGeneratorProfiles",
                params: {
                    data: [testGeneratorProfile],
                },
                id: "SetTestGeneratorProfiles",
            });
        }
    } catch (error) {
        console.log(error);
        console.log(JSON.stringify(testGeneratorProfile, null, 2));
        return false;
    }
};
