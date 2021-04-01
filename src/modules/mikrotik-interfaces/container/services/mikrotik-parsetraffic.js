'use strict';
const formatBps = require('../utils/format-bps');

module.exports = async (traffic) => {

    const integerFields = [
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
    ];

    for (var i in integerFields) {
        if (integerFields[i] in traffic) {
            traffic[integerFields[i]] = parseInt(traffic[integerFields[i]]) ?? 0;
        }
    }

    traffic['tx-bps-text'] = formatBps(traffic['tx-bits-per-second']);
    traffic['rx-bps-text'] = formatBps(traffic['rx-bits-per-second']);

    // add timestamp
    traffic['timestamp'] = Date.now();
    return traffic;
};

