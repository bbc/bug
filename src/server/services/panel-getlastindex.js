"use strict";

const panelConfigModel = require("@models/panel-config");

module.exports = async (group = "") => {
    const panelConfig = await panelConfigModel.list();

    const sortedList = panelConfig
        .filter((p) => p.group === group)
        .sort(function (a, b) {
            return a.order < b.order ? 1 : -1;
        });

    return sortedList.length > 0 ? sortedList[0].order + 1 : 0;
};
