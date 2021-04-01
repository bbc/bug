'use strict';

module.exports = async (stats) => {

    const integerFields = [
        'sfp-link-length-copper'
    ];

    const booleanFields = [
        'full-duplex',
        'tx-flow-control',
        'rx-flow-control',
        'sfp-module-present',
        'sfp-rx-loss',
        'sfp-tx-fault',
    ];

    const arrayFields = [
        'advertising',
        'link-partner-advertising'
    ];

    for (var i in integerFields) {
        if (integerFields[i] in stats) {
            stats[integerFields[i]] = parseInt(stats[integerFields[i]]) ?? 0;
        }
    }
    
    for (var i in booleanFields) {
        if (booleanFields[i] in stats) {
            stats[booleanFields[i]] = (stats[booleanFields[i]] === 'true');
        }
    }

    for (var i in arrayFields) {
        if (arrayFields[i] in stats) {
            stats[arrayFields[i]] = stats[arrayFields[i]].split(',');
        }
    }

    // remove eeprom field
    if('eeprom' in stats) {
        delete stats.eeprom;
    }

    // add timestamp
    stats['timestamp'] = Date.now();
    return stats;
};

