'use strict';

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn, interfaceName) => {

    // print the interface menu
    try {
        var data = await conn.write('/interface/monitor-traffic', [
            '=interface=' + interfaceName,
            '=once='
        ]);

        if (!data || data.length !== 1) {
            // just use an empty result - so that we overwrite the database entry
            data = [{
                name: interfaceName
            }];
        }
        return mikrotikParseResults({
            result: data[0],
            integerFields: [
                'rx-packets-per-second',
                'rx-bits-per-second',
                'fp-rx-packets-per-second',
                'fp-rx-bits-per-second',
                'rx-drops-per-second',
                'rx-errors-per-second',
                'tx-packets-per-second',
                'tx-bits-per-second',
                'fp-tx-packets-per-second',
                'fp-tx-bits-per-second',
                'tx-drops-per-second',
                'tx-queue-drops-per-second',
                'tx-errors-per-second'

            ],
            booleanFields: [],
            timeFields: [],
            arrayFields: [],
            deleteFields: [],
            bitrateFields: ['tx-bits-per-second', 'rx-bits-per-second'],
        })

    } catch (error) {
        console.log(`mikrotik-fetchtraffic: error fetching interface information for ${interfaceName}`);
    }
    return null;
};

