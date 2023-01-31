"use strict";

const configGet = require("@core/config-get");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

module.exports = async () => {
    const config = await configGet();
    console.log("device-save: saving device config ...");

    const result = await ciscoIOSXEApi.create({
        host: config["address"],
        path: `/restconf/operations/cisco-ia:save-config/`,
        data: null,
        timeout: 5000,
        username: config["username"],
        password: config["password"],
    });

    if (result?.["cisco-ia:output"]?.result.indexOf("successful") > -1) {
        console.log("device-save: success");
    } else {
        console.log("device-save: failed");
        console.log(result);
    }
};
