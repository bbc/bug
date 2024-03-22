"use strict";

const prodigyCommand = require("@utils/prodigy-command");

module.exports = async (destinatonIndex, sourceIndex) => {
    return await prodigyCommand(["settings", "easy_routing", parseInt(destinatonIndex)], parseInt(sourceIndex));
};
