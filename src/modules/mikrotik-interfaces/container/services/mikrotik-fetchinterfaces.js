'use strict';

const mikrotikParseInterface = require('./mikrotik-parseinterface');

module.exports = async (conn) => {

    // print the interface menu
    try {
        var data = await conn.write("/interface/print");
    } catch (error) {
        console.log("error fetching interface information");
        return;
    }

    // process data
    var interfaces = [];
    for (var i in data) {
        interfaces.push(await mikrotikParseInterface(data[i]));
    }
    return interfaces;
};

