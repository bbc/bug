"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ magewellClient, mongoSingle }) => {


    const streamTypes = {
        0: "RTMP",
        1: "Twitch",
        2: "YouTube",
        3: "Facebook",
        100: "RTSP",
        120: "SRT Caller",
        121: "SRT Listener",
        130: "NDI HX",
        131: "HLS",
        132: "UDP",
        133: "RTP"
    }

    try {
        const response = await magewellClient.request("get-servers", {}, { requireAuth: false });

        const payload = response?.payload;

        if (!payload) {
            logger.error("missing servers payload from magewell device");
            return false;
        }
        const parsedPayload = payload["stream-server"].map((s) => {
            return {
                "type": s.type,
                "_typeDescription": streamTypes[s.type] ?? "Unknown",
                "name": s.name,
                "is-use": s['is-use'],
                "url": s.url,
                "port": s.port,
                "stream-index": s['stream-index'],
            }
        });

        await mongoSingle.set("servers",
            parsedPayload
            , 60);

        logger.debug(`fetched and saved servers payload`);
        return true;
    } catch (error) {
        logger.error(`servers polling failed: ${error.message}`);
        throw error;
    }
};
