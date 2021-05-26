"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");

module.exports = async (index, type, label) => {
    if (!["input", "output"].includes(type)) {
        console.log(`videohub-setlabel: invalid type '${type}'`);
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
        console.log(`videohub-setlabel: failed to fetch config`);
        return false;
    }

    try {
        const field = type == "output" ? "OUTPUT LABELS" : "INPUT LABELS";
        const command = `${index} ${label}`;

        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send(field, command);
        return true;
    } catch (error) {
        console.log("videohub-setlabel: ", error);
        return false;
    }
};
