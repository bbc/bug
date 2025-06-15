"use strict";
const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");

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
// 28: MADI4.SRC.IO
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
            label: `NET${labelIndex + 1} / MADI${groupIndex + 1}`,
            value: range(startIndex + 64 * groupIndex, 64),
            fixed: true,
        };
    });
};

// DANTE card for network port
const moduleNetwork = (labelIndex, startIndex) => {
    return [
        {
            label: `NET${labelIndex + 1} / DANTE`,
            value: range(startIndex, 128),
            fixed: true,
        },
    ];
};

module.exports = async (type = "source") => {
    const status = await mongoSingle.get("status");

    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`group-list: failed to fetch config`);
        return false;
    }

    const customLabels = config?.[`${type}Labels`] ?? [];
    const customGroups = config?.[`${type}Groups`] ?? [];
    let groups = [];

    for (let moduleIndex = 0; moduleIndex < 6; moduleIndex++) {
        const moduleType = status?.module_type?.[moduleIndex];

        try {
            switch (moduleType?.["name"]) {
                case "MADI4.SRC.IO": {
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
        } catch (error) {
            console.log(`group-list: ERROR`, moduleIndex, status?.module_type);
        }
    }

    // then the built in ports
    groups.push({
        label: `MADI 1`,
        value: range(1536, 64),
        fixed: true,
    });

    groups.push({
        label: `MADI 2`,
        value: range(1600, 64),
        fixed: true,
    });

    if (type === "destination") {
        groups.push({
            label: `Phones 1`,
            value: range(1664, 2),
            fixed: true,
        });

        groups.push({
            label: `Phones 2`,
            value: range(1666, 2),
            fixed: true,
        });
    }

    if (type === "source") {
        groups.push({
            label: `Test`,
            value: range(1666, 6),
            fixed: true,
        });
    }

    // then overwrite labels with custom labels from config
    groups = groups.map((group, index) => {
        return {
            ...group,
            defaultLabel: group["label"],
            label: customLabels?.[index] ?? group["label"],
            index: index,
        };
    });

    // store the number of items
    const groupCount = groups.length;

    // lastly add any extra custom groups
    for (const [groupIndex, group] of Object.entries(customGroups)) {
        groups.push({
            ...group,
            defaultLabel: "",
            fixed: false,
            index: parseInt(groupIndex) + groupCount,
        });
    }

    return groups;
};
