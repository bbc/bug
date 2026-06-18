"use strict";

const statusGetDefault = require("./status-getdefault");

module.exports = async () => {
    return [].concat(await statusGetDefault());
};
