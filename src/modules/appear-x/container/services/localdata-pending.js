"use strict";

const localdataGet = require("@services/localdata-get");

module.exports = async (serviceId) => {
    // check localdata first (because we may have unsaved changes)
    return (await localdataGet(serviceId)) ? true : false;
};
