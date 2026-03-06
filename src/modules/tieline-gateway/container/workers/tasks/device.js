"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ tielineApi, mongoSingle }) => {
    try {

        const [rtpConfig, systemConfig, qosConfig] = await Promise.all([
            tielineApi.get("/api/get_config?config-param=RTP"),
            tielineApi.get("/api/get_config?config-param=SYSTEM"),
            tielineApi.get("/api/get_config?config-param=QOS"),
        ]);

        const rtp = rtpConfig?.result?.config;
        const system = systemConfig?.result?.config;
        const qos = qosConfig?.result?.config;

        const device = {
            localSessionPort: rtp?.LISTEN_PORT?._text,
            localAltSessionPort: rtp?.ALT_LISTEN_PORT?._text,
            hostname: system?.HOSTNAME_STR?._text,
            dscp: qos?.DSCP?._text,
        };

        await mongoSingle.set("device", device, 240);

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(`device: ${error?.message || error}`);
        throw error;
    }
};