"use strict";

const appearXApi = require("@utils/appearx-api");
const configGet = require("@core/config-get");

module.exports = async (decodeVideoProfile) => {
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
            console.log(`mpegdecodevideoprofile-update: updating profile id ${decodeVideoProfile.key}`);
            // post value to device
            return await XApi.post({
                path: "mmi/service_decoderpool/api/jsonrpc",
                method: "Xger:2.31/videoProfile/SetVideoProfiles",
                params: {
                    data: [decodeVideoProfile],
                },
                id: "SetVideoProfiles",
            });
        }
    } catch (error) {
        console.log(error);
        console.log(JSON.stringify(decodeVideoProfile, null, 2));
        return false;
    }
};
