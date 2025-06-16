"use strict";

const logger = require("@core/logger")(module);
const ultrixWebApi = require("@utils/ultrix-webapi");

module.exports = async (address, port) => {

    try {
        await ultrixWebApi.get("groupcategory/agdatassds", { address: address, uiPort: port });
        return true;
    } catch (error) {
        return false;
    }
};
