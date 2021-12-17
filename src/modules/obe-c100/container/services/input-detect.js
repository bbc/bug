"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const snmpAwait = require("@core/snmp-await");

module.exports = async () => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    const oid = `1.3.6.1.4.1.40562.3.2.5.1.1.5.${config.encoderIndex}`;

    let result = await snmpAwait.get({
        host: config.address,
        community: config.snmpCommunity,
        maxRepetitions: 1000,
        oid: oid,
    });

    if (result === 19) {
        return 19;
    }

    // update localdata with the results
    const localdata = mongoSingle.get("localdata");
    localdata.inputVideoFormat = result;

    if (!mongoSingle.set("localdata", localdata)) {
        throw new Error();
    }
    return result;
};
