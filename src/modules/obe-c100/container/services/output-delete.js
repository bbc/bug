"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async (outputIndex) => {
    // so ... to remove one of the outputs, we need to copy across all the codecdata into the localdata

    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    // fetch codec data
    let codecData = await mongoSingle.get("codecdata");

    // fetch local data
    let localData = await mongoSingle.get(`localdata_${deviceId}`);
    if (!localData) {
        localData = {};
    }

    if (!localData.outputs) {
        localData.outputs = codecData.outputs;
    }

    // check the output index is valid
    if (!localData.outputs[outputIndex]) {
        return false;
    }

    // remove the specified array element
    localData.outputs.splice(outputIndex, 1);

    // save and return
    return await mongoSingle.set(`localdata_${deviceId}`, localData);
};
