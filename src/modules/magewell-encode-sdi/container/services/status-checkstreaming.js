
'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    try {
        const servers = await mongoSingle.get("servers");
        const status = await mongoSingle.get("status");
        const signal = await mongoSingle.get("signal");
        let message = "";
        const hasInputVideo = signal?._active ?? false;

        if (status?._isLive) {

            // does it have a valid input?
            if (!hasInputVideo) {
                return new StatusItem({
                    message: `Device has no valid input signal`,
                    key: "defaultservice",
                    type: "warning",
                    flags: [],
                })
            }

            const outputCount = servers?.length || 0;
            const activeOutputCount = servers?.filter(s => s?.['is-use'])?.length || 0;

            if (activeOutputCount > 0) {
                return new StatusItem({
                    message: `Device streaming to ${activeOutputCount}/${outputCount} output(s)`,
                    key: "defaultservice",
                    type: "success",
                    flags: [],
                })
            }
        }

    } catch (err) {
        logger.error(err.stack || err.message);
    }
    return [];
};