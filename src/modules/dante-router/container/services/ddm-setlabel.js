"use strict";

const configGet = require("@core/config-get");

module.exports = async (index, type, label) => {
    if (type === "source") {
        type = "input";
    }

    if (type === "destination") {
        type = "output";
    }

    if (!["input", "output"].includes(type)) {
        console.log(`ddm-setlabel: invalid type '${type}'`);
        return false;
    }

    if (label === "" || label === undefined || label === null) {
        label = "-";
    }

    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-setlabel: failed to fetch config`);
        return false;
    }

    try {
        return true;
    } catch (error) {
        console.log("ddm-setlabel: ", error);
        return false;
    }
};
