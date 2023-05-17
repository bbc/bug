"use strict";

const appearXApi = require("@utils/appearx-api");
const configGet = require("@core/config-get");

module.exports = async (outputs) => {
    try {
        const config = await configGet();
        if (!config) {
            return false;
        }

        // console.dir(outputs, { depth: null });
        // connect to API
        const XApi = new appearXApi({
            host: config.address,
            username: config.username,
            password: config.password,
        });

        if (await XApi.connect()) {
            // sort outputs into slots
            const outputsBySlot = {};

            for (let eachOutput of outputs) {
                if (!outputsBySlot[eachOutput["slot"]]) {
                    outputsBySlot[eachOutput["slot"]] = [];
                }
                outputsBySlot[eachOutput["slot"]].push(eachOutput);
            }

            for (const [cardIndex, eachObject] of Object.entries(outputsBySlot)) {
                console.log(`mpegencoderoutputs-update: updating outputs on card ${cardIndex}`);

                // post value to device
                if (
                    !(await XApi.post({
                        path: `board/${cardIndex}/api/jsonrpc`,
                        method: "ipGateway:1.31/output/SetOutputs",
                        params: {
                            data: eachObject.map((o) => {
                                return {
                                    key: o.key,
                                    value: o.value,
                                };
                            }),
                        },
                        id: "SetOutputs",
                    }))
                ) {
                    return false;
                }
            }
            return true;
        }
    } catch (error) {
        console.log(error);
        console.log(JSON.stringify(encoderService, null, 2));
        return false;
    }
};
