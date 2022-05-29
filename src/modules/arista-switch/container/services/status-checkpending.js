"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const pending = await mongoSingle.get("pending");
    if (pending) {
        return [
            new StatusItem({
                key: `pending`,
                message: [`Device has unsaved changes`],
                type: "warning",
            }),
        ];
    }
    return [];
};
