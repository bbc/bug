"use strict";

const mongoSingle = require("@core/mongo-single");
const StatusItem = require("@core/StatusItem");
const ApiStatus = require("../utils/api-status");

module.exports = async () => {
    const status = await mongoSingle.get("status");

    const errorStatusCodes = [30, 29, 28, 27, 25, 24, 23];
    let statusItems = [];

    for (let eachServer of status?.['live-status']?.['live']) {
        if (errorStatusCodes.includes(eachServer?.['result'])) {
            const apiStatus = ApiStatus(eachServer?.['result']);
            statusItems.push(new StatusItem({
                key: eachServer?.['id'],
                message: [`${eachServer?.['name']} is ${apiStatus?.['message']}`],
                type: apiStatus?.['type']
            }));
        }
    }

    return statusItems;

};