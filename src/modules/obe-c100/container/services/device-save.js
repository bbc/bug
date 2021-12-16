"use strict";

const mongoSingle = require("@core/mongo-single");
const snmpAwait = require("@core/snmp-await");
const obeOids = require("@utils/obe-oids");
const configGet = require("@core/config-get");
const mergedCodecdata = require("@services/codecdata-get");

const send = async (config, values) => {
    console.log(values);
    if (values && values.length > 0) {
        return await snmpAwait.setMultiple({
            host: config.address,
            community: config.snmpCommunity,
            values: values,
        });
    }
    // nothing to do
    return true;
};

module.exports = async () => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // get current codec data
    const codecdata = await mongoSingle.get("codecdata");

    // get list of changes
    const localdata = await mongoSingle.get("localdata");

    try {
        // saves device config back
        const deviceOids = obeOids.getDevice(config.encoderIndex);

        let valuesToSend = [];
        for (const [name, value] of Object.entries(localdata)) {
            // get the oid
            const oid = Object.keys(deviceOids).find((key) => deviceOids[key] === name);
            if (oid) {
                valuesToSend.push({ oid, value });
            }
        }

        // send the device values
        if (!(await send(config, valuesToSend))) {
            return false;
        }
        valuesToSend = [];

        // now audio
        if (codecdata?.audio?.length > 1) {
            // we have to remove the extra audio channels from the device first
            for (let a = 1; a < codecdata.audio.length; a++) {
                valuesToSend.push({ oid: `1.3.6.1.4.1.40562.3.2.7.1.1.13.${config.encoderIndex}.${a}`, value: 6 });
            }
        }

        // send the command to remove the audio channels
        if (!(await send(config, valuesToSend))) {
            return false;
        }
        valuesToSend = [];

        // prep the audio channels
        const audio = localdata.audio ? localdata.audio : codecdata.audio;
        audio.forEach((audioTrack, index) => {
            if (index > 0) {
                // if it's not the first channel (which always exists) we should add it first
                valuesToSend.push({
                    oid: `1.3.6.1.4.1.40562.3.2.7.1.1.13.${config.encoderIndex}.${index}`,
                    value: 4,
                });
            }

            // get list of oids for this audio channel
            const audioOids = obeOids.getAudio(config.encoderIndex, index);

            for (const [name, value] of Object.entries(audioTrack)) {
                // get the oid
                const oid = Object.keys(audioOids).find((key) => audioOids[key] === name);
                if (oid) {
                    valuesToSend.push({ oid, value });
                }
            }
        });

        // send the command to add the audio channels back
        if (!(await send(config, valuesToSend))) {
            return false;
        }
        valuesToSend = [];

        // now outputs
        if (codecdata?.outputs.length > 1) {
            // we have to remove the extra outputs from the device first
            for (let a = 1; a < codecdata?.outputs?.length; a++) {
                valuesToSend.push({ oid: `1.3.6.1.4.1.40562.3.2.10.1.1.12.${config.encoderIndex}.${a}`, value: 6 });
            }
        }

        // send the command to remove any extra outputs
        if (!(await send(config, valuesToSend))) {
            return false;
        }
        valuesToSend = [];

        // prep the output channels
        const outputs = localdata.outputs ? localdata.outputs : codecdata.outputs;
        outputs.forEach((output, index) => {
            if (index > 0) {
                // if it's not the first output (which always exists) we should add it first
                valuesToSend.push({ oid: `1.3.6.1.4.1.40562.3.2.10.1.1.12.${config.encoderIndex}.${index}`, value: 4 });
            }

            // get list of oids for this output
            const outputOids = obeOids.getOutput(config.encoderIndex, index);

            for (const [name, value] of Object.entries(output)) {
                // get the oid
                const oid = Object.keys(outputOids).find((key) => outputOids[key] === name);
                if (oid) {
                    valuesToSend.push({ oid, value });
                }
            }
        });

        // send the command to add the outputs back
        if (!(await send(config, valuesToSend))) {
            return false;
        }

        // it's worked ... so we overwrite codecdata with the new values
        await mongoSingle.set("codecdata", await mergedCodecdata());
        // and then clear the localdata
        await mongoSingle.set("localdata", {});
        return true;
    } catch (error) {
        console.log(`device-save: ${error}`);
    }
    return false;
};
