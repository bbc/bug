'use strict';

const mikrotikParseTraffic = require('./mikrotik-parsetraffic');

module.exports = async (conn, interfaceName) => {

    // print the interface menu
    try {
        var data = await conn.write('/interface/monitor-traffic', [
            '=interface=' + interfaceName,
            '=once='
        ]);

        if(!data || data.length !== 1) {
            // just use an empty result - so that we overwrite the database entry
            data = [{
                name: interfaceName
            }];
        }
        return await(mikrotikParseTraffic(data[0]));

    } catch (error) {
        console.log(`mikrotik-fetchtraffic: error fetching interface information for ${interfaceName}`);
    }
    return null;
};

