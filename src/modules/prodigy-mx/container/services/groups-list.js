"use strict";
const mongoSingle = require("@core/mongo-single");
const range = (start, length) => Array.from({ length: length }, (_, i) => start + i);

// Module type code
// 0: SC.IO mm
// 1: SC.IO sm
// 2: BNC.IO
// 3: SFP.IO
// 4: AN8.I
// 5: AN8.O
// 6: MIC8.LINE.I
// 7: MIC8.HD.I
// 8: AES4.IO
// 9: AES4.SRC.IO
// 10: RAV.IO
// 11: DANTE.IO
// 12: SG.IO
// 13: AVB.IO
// 15: AN8.IO
// 16: MIC8.LINE.IO
// 17: MIC8.HD.IO
// 18: RAV.SRC.IO
// 19: DANTE.SRC.IO
// 20: SG.SRC.IO
// 32: AN8.I (ESS)
// 33: AN8.O (ESS)
// 34: MIC8.LINE.I (ESS)
// 35: MIC8.HD.I (ESS)
// 36: AN8.IO (ESS)
// 37: MIC8.LINE.IO (ESS)
// 38: MIC8.HD.IO (ESS)
// 39: AN8.IO (HYBRID)
// 40: MIC8_LINE_IO (HYBRID)
// 41: MIC8.HD.IO (HYBRID)
// 254: UNKNOWN
// 255: N_A

// MADI option card for network port
const moduleMadi = (labelIndex, startIndex) => {
    return [0, 1, 2, 3].map((groupIndex) => {
        return {
            name: `NET${labelIndex + 1} / MADI${groupIndex + 1}`,
            value: range(startIndex + 64 * groupIndex, 64),
        };
    });
};

// DANTE card for network port
const moduleNetwork = (labelIndex, startIndex) => {
    return [
        {
            name: `NET${labelIndex + 1} / DANTE`,
            value: range(startIndex, 128),
        },
    ];
};

module.exports = async (type = "source") => {
    const status = await mongoSingle.get("status");

    let groups = [];

    for (let moduleIndex = 0; moduleIndex < 6; moduleIndex++) {
        const moduleType = status?.module_type?.[moduleIndex];
        const net = status?.net?.[moduleIndex];

        // only for online cards
        if (net?.online) {
            switch (moduleType.deviceType) {
                case "SC.IO mm": {
                    groups = groups.concat(moduleMadi(moduleIndex, moduleIndex * 256));
                    break;
                }
                case "SC.IO sm": {
                    groups = groups.concat(moduleMadi(moduleIndex, moduleIndex * 256));
                    break;
                }
                case "DANTE.IO": {
                    groups = groups.concat(moduleNetwork(moduleIndex, moduleIndex * 256));
                    break;
                }
                default:
                    break;
            }
        }
    }

    // then the built in ports
    groups.push({
        name: `MADI 1`,
        value: range(1536, 64),
    });

    groups.push({
        name: `MADI 2`,
        value: range(1600, 64),
    });

    if (type === "destination") {
        groups.push({
            name: `Phones 1`,
            value: range(1664, 2),
        });

        groups.push({
            name: `Phones 2`,
            value: range(1666, 2),
        });
    }

    return groups;
};
