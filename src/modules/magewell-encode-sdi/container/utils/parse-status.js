"use strict";

const STATUS_FLAGS = Object.freeze({
    isFirst: 0x01,
    isRecord: 0x02,
    isLiving: 0x04,
    isStream: 0x08,
    isDiskReady: 0x10,
    isRTMPReady: 0x20,
    isSoftAP: 0x40,
    isMIC: 0x100,
    isPHONE: 0x200,
    isOutput: 0x400,
    isDiskTest: 0x1000,
    isBlue: 0x2000,
    isUpgrade: 0x4000,
    isNetTest: 0x8000,
    isPasswd: 0x10000,
    isOccupied: 0x20000,
    isFormatDisk: 0x100000,
    isFormatSD: 0x200000,
    isSearchWifi: 0x400000,
    isConnectWifi: 0x800000,
    isConnectBlue: 0x1000000,
    isCheckUpgrade: 0x2000000,
    isReset: 0x4000000,
    isIPv6: 0x8000000,
    isTestLock: 0x10000000,
    isReboot: 0x20000000,
});

const parseStatus = (curStatus, flagName) => {
    const parsedStatus = Number(curStatus);

    if (!Number.isFinite(parsedStatus) || !Number.isInteger(parsedStatus) || parsedStatus < 0 || !flagName) {
        return false;
    }

    const mask = STATUS_FLAGS[flagName];

    if (!mask) {
        return false;
    }

    return (parsedStatus & mask) === mask;
};

module.exports = parseStatus;
module.exports.STATUS_FLAGS = STATUS_FLAGS;