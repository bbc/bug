"use strict";

const prodigyCommand = require("@utils/prodigy-command");

module.exports = async (type, buttonIndex, label = "") => {
    const typeMap = {
        source: "input_labels",
        destination: "output_labels",
    };
    return await prodigyCommand(["settings", typeMap[type], buttonIndex], label);
};
