"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async (interfaceId) => {
    const config = await configGet();

    console.log(`interface-enable: disabling interface ${interfaceId} ...`);

    // enable interface using your device API
};
