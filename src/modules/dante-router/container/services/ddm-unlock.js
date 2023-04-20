"use strict";

const configGet = require("@core/config-get");

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-lock: failed to fetch config`);
        return false;
    }

    try {
        return true;
    } catch (error) {
        console.log("ddm-lock: ", error);
        return false;
    }
};
