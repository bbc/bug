'use strict';

/**
 * core/format-bps.js
 * Returns value with bits-per-second appended to end of string
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

module.exports = (bits, decimals) => {
    if (bits === 0) return '0';
    if (decimals === undefined) {
        decimals = 2;
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['b/s', 'Kb/s', 'Mb/s', 'Gb/s', 'Tb/s', 'Pb/s'];

    const i = Math.floor(Math.log(bits) / Math.log(k));

    return parseFloat((bits / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}