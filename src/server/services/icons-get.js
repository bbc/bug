"use strict";

const logger = require("@utils/logger")(module);
const iconsList = require("@services/icons-list");

module.exports = async (iconName, variant = null, length = null) => {
    if (variant === "") {
        variant = null;
    }

    let iconList = await iconsList(variant);

    if (iconName) {
        iconList = iconList.filter(function (icon) {
            return icon.indexOf(iconName) > -1;
        });
    }

    const listLength = iconList.length;

    if (length && listLength > length) {
        iconList = iconList.slice(0, length);
    }
    return {
        icons: iconList,
        length: listLength,
    };
};
