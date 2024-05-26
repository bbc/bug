"use strict";

const appearXApi = require("@utils/appearx-api");
const configGet = require("@core/config-get");
const inputServiceKeysGet = require("@services/inputservicekeys-get");
const ipOutputsFilter = require("@services/ipoutputs-filter");

module.exports = async (encoderService, outputs) => {
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

            // so ... this is a little more complex than I first thought. We need to compare this updated list to the existing, and
            // pathologically delete any missing outputs. Any new ones will just get created by the POST update request

            // fetch the guid of the matching input service
            const inputServiceKeys = await inputServiceKeysGet(encoderService);

            // and now use that to fetch any matching outputs
            const existingOutputs = await ipOutputsFilter(inputServiceKeys);

            const outputIdsToDelete = [];
            const outputIdsToDeleteByCard = {};
            for (const eachOutput of existingOutputs) {
                if (!outputs.find((o) => o.key === eachOutput.key)) {
                    if (!outputIdsToDeleteByCard[eachOutput["slot"]]) {
                        outputIdsToDeleteByCard[eachOutput["slot"]] = [];
                    }
                    outputIdsToDeleteByCard[eachOutput["slot"]].push(eachOutput.key);
                    outputIdsToDelete.push(eachOutput.key);
                }
            }

            // update/add outputs
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

            // delete any remaining
            for (const [cardIndex, outputIdArray] of Object.entries(outputIdsToDeleteByCard)) {
                console.log(
                    `mpegencoderoutputs-update: deleting ${outputIdArray.length} output(s) on card ${cardIndex}`
                );

                // post value to device
                if (
                    !(await XApi.post({
                        path: `board/${cardIndex}/api/jsonrpc`,
                        method: "ipGateway:1.31/output/DeleteOutputs",
                        params: {
                            ids: outputIdArray,
                        },
                        id: "DeleteOutputs",
                    }))
                ) {
                    return false;
                }
            }

            return outputIdsToDelete;
        }
    } catch (error) {
        console.log(error);
        console.log(JSON.stringify(encoderService, null, 2));
        return false;
    }
};
