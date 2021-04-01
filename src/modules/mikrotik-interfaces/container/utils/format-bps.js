'use strict';

module.exports = (bits, decimals) => {
    if (bits === 0) return '0';
    if (decimals === undefined) {
        decimals = 2;
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B/s', 'Kb/s', 'Mb/s', 'Gb/s', 'Tb/s', 'Pb/s'];

    const i = Math.floor(Math.log(bits) / Math.log(k));

    return parseFloat((bits / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}