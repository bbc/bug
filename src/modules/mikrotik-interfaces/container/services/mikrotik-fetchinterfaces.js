'use strict';

const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async (conn) => {

    var data = await conn.write("/interface/print");

    // process data
    var interfaces = [];
    for (var i in data) {
        interfaces.push(
            mikrotikParseResults({
                result: data[i],
                integerFields: ['mtu',
                    'actual-mtu',
                    'l2mtu',
                    'max-l2mtu',
                    'link-downs',
                    'rx-byte',
                    'tx-byte',
                    'rx-packet',
                    'tx-packet',
                    'rx-drop',
                    'tx-drop',
                    'tx-queue-drop',
                    'tx-error',
                    'rx-error',
                    'fp-rx-byte',
                    'fp-tx-byte',
                    'fp-rx-packet',
                    'fp-tx-packet'
                ],
                booleanFields: ['running',
                    'slave',
                    'disabled'
                ],
                timeFields: [],
            })
        );
    }
    return interfaces;
};

