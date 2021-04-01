'use strict';

const mikrotikParseLinkStats = require('../services/mikrotik-parselinkstats');

module.exports = async (conn, interfaceName) => {

    try {
        var data = await conn.write('/interface/ethernet/monitor', [
            '=numbers=' + interfaceName,
            '=once='
        ]);

        if(!data || data.length !== 1) {
            // just use an empty result - so that we overwrite the database entry
            data = [{
                name: interfaceName
            }];
        }
        return await(mikrotikParseLinkStats(data[0]));

    } catch (error) {
        console.log(`fetch-linkstats: error fetching interface ${interfaceName}`);
    }
    return null;
};

