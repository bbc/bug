"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId, newName) => {
    const config = await configGet();

    console.log(`interface-rename: renaming interface ${interfaceId} to '${newName}' ...`);

    // rename interface using your device API
};
