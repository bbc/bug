"use strict";

const panelConfig = require("@models/panel-config");

module.exports = async () => {
    return await panelConfig.list();
};
