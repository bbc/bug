'use strict';

const mikrotikParseInterface = require('./mikrotik-parseinterface');

module.exports = async (conn) => {

    var data = await conn.write("/interface/print");

    // process data
    var interfaces = [];
    for (var i in data) {
        interfaces.push(await mikrotikParseInterface(data[i]));
    }
    return interfaces;
};

