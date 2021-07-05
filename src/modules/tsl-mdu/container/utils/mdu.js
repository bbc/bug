"use strict";

const path = require("path");

module.exports = async (config) => {
    try {
        const MDU = require(path.join(__dirname, config?.model));
        return await new MDU(config);
    } catch (error) {
        console.log(error);
    }
};
