"use strict";

const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");
const configGet = require("@core/config-get");
const mpegEncoderServiceGet = require("@services/mpegencoderservice-get");

module.exports = async (options) => {
    const mpegEncoderServices = await mongoSingle.get("mpegEncoderServices");

    const totalCount = mpegEncoderServices.length;
    const enabledCount = mpegEncoderServices.filter((es) => es.value.enabled).length;

    if (enabledCount > 0) {
        return new StatusItem({
            message: `${enabledCount} service(s) enabled`,
            key: "servicesactive",
            type: "success",
            flags: [],
        })
    }
    else if (totalCount > 0) {
        return new StatusItem({
            message: `${totalCount} service(s) defined and idle`,
            key: "servicestotal",
            type: "default",
            flags: [],
        })
    };
    return [];
}
