"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const getSecondsBetween = (currentTimestamp, previousTimestamp) => {
    const currentMs = new Date(currentTimestamp).getTime();
    const previousMs = new Date(previousTimestamp).getTime();
    if (!Number.isFinite(currentMs) || !Number.isFinite(previousMs) || currentMs <= previousMs) {
        return 0;
    }

    return (currentMs - previousMs) / 1000;
};

const perSecond = (currentValue, previousValue, elapsedSeconds, multiplier = 1) => {
    const delta = parseInt(currentValue ?? 0) - parseInt(previousValue ?? 0);
    if (elapsedSeconds <= 0 || !Number.isFinite(delta) || delta < 0) {
        return 0;
    }

    return Math.floor((delta * multiplier) / elapsedSeconds);
};

module.exports = (currentInterface, previousInterface = null) => {
    const elapsedSeconds = previousInterface
        ? getSecondsBetween(currentInterface.timestamp, previousInterface.timestamp)
        : 0;

    return mikrotikParseResults({
        result: {
            name: currentInterface.name,
            "rx-packets-per-second": perSecond(currentInterface["rx-packet"], previousInterface?.["rx-packet"], elapsedSeconds),
            "rx-bits-per-second": perSecond(currentInterface["rx-byte"], previousInterface?.["rx-byte"], elapsedSeconds, 8),
            "fp-rx-packets-per-second": perSecond(
                currentInterface["fp-rx-packet"],
                previousInterface?.["fp-rx-packet"],
                elapsedSeconds
            ),
            "fp-rx-bits-per-second": perSecond(
                currentInterface["fp-rx-byte"],
                previousInterface?.["fp-rx-byte"],
                elapsedSeconds,
                8
            ),
            "rx-drops-per-second": perSecond(currentInterface["rx-drop"], previousInterface?.["rx-drop"], elapsedSeconds),
            "rx-errors-per-second": perSecond(currentInterface["rx-error"], previousInterface?.["rx-error"], elapsedSeconds),
            "tx-packets-per-second": perSecond(currentInterface["tx-packet"], previousInterface?.["tx-packet"], elapsedSeconds),
            "tx-bits-per-second": perSecond(currentInterface["tx-byte"], previousInterface?.["tx-byte"], elapsedSeconds, 8),
            "fp-tx-packets-per-second": perSecond(
                currentInterface["fp-tx-packet"],
                previousInterface?.["fp-tx-packet"],
                elapsedSeconds
            ),
            "fp-tx-bits-per-second": perSecond(
                currentInterface["fp-tx-byte"],
                previousInterface?.["fp-tx-byte"],
                elapsedSeconds,
                8
            ),
            "tx-drops-per-second": perSecond(currentInterface["tx-drop"], previousInterface?.["tx-drop"], elapsedSeconds),
            "tx-queue-drops-per-second": perSecond(
                currentInterface["tx-queue-drop"],
                previousInterface?.["tx-queue-drop"],
                elapsedSeconds
            ),
            "tx-errors-per-second": perSecond(currentInterface["tx-error"], previousInterface?.["tx-error"], elapsedSeconds),
        },
        integerFields: [
            "rx-packets-per-second",
            "rx-bits-per-second",
            "fp-rx-packets-per-second",
            "fp-rx-bits-per-second",
            "rx-drops-per-second",
            "rx-errors-per-second",
            "tx-packets-per-second",
            "tx-bits-per-second",
            "fp-tx-packets-per-second",
            "fp-tx-bits-per-second",
            "tx-drops-per-second",
            "tx-queue-drops-per-second",
            "tx-errors-per-second",
        ],
        booleanFields: [],
        timeFields: [],
        arrayFields: [],
        deleteFields: [],
        bitrateFields: ["tx-bits-per-second", "rx-bits-per-second"],
    });
};
