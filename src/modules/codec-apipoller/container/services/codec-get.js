"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async (codecId) => {
    try {
        if (!codecId) {
            throw new Error("codecId is required");
        }

        const codecs = await mongoSingle.get("codecs");
        if (!Array.isArray(codecs)) {
            throw new Error("no codec data available");
        }

        const codec = codecs.find((item) => String(item?.id) === String(codecId));
        if (!codec) {
            throw new Error(`codec ${codecId} not found`);
        }

        return codec;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
