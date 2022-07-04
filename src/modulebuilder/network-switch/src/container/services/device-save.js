"use strict";

const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    console.log("device-save: saving device config ...");

    // save device config via API

    console.log("device-save: success");
};
