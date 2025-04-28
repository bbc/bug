"use strict";

const StatusItem = require("@core/StatusItem");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    const passwordExpired = await mongoSingle.get("passwordexpired");
    if (passwordExpired) {
        return [
            new StatusItem({
                key: `passwordExpired`,
                message: [`Device SSH password has expired - please update`],
                type: "error",
            }),
        ];
    }
    return [];
};
