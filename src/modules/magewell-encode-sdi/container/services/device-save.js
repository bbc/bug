"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const magewellEncodeSdi = require("@utils/magewell-encode-sdi");
const codecdataGet = require("@services/codecdata-get");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async () => {
    const config = await configGet();
    if (!config) {
        throw new Error("Missing module config");
    }

    const deviceId = await deviceIdGet();
    const localdata = (await mongoSingle.get(`localdata_${deviceId}`)) || {};

    if (Object.keys(localdata).length === 0) {
        return true;
    }

    const mergedSettings = await codecdataGet();
    if (typeof mergedSettings["use-nosignal-file"] === "boolean") {
        mergedSettings["use-nosignal-file"] = mergedSettings["use-nosignal-file"] ? 1 : 0;
    }

    const magewellClient = magewellEncodeSdi.createClient({
        address: config.address,
        username: config.username,
        password: config.password,
        apiPath: "/usapi",
        codeField: "result",
        autoLogin: false,
    });

    try {
        await magewellClient.login();
        const response = await magewellClient.request("set-settings", mergedSettings);
        if (!response || response.ok !== true) {
            logger.warning("device save failed: set-settings returned non-ok response");
            return false;
        }

        await mongoSingle.set("settings", mergedSettings);
        await mongoSingle.set(`localdata_${deviceId}`, {});
        return true;
    } catch (error) {
        logger.error(`device save failed: ${error.message}`);
        return false;
    }
};