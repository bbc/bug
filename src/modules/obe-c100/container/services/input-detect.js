"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const SnmpAwait = require("@core/snmp-await");
const deviceIdGet = require("@services/deviceid-get");

module.exports = async () => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // fetch hashed address of device to use as id
    const deviceId = await deviceIdGet();

    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: config.address,
        community: config.snmpCommunity,
    });

    const oid = `1.3.6.1.4.1.40562.3.2.5.1.1.5.${config.encoderIndex}`;

    let result = await snmpAwait.get({
        maxRepetitions: 1000,
        oid: oid,
    });

    if (result === 19) {
        return 19;
    }

    // update localdata with the results
    const localdata = mongoSingle.get(`localdata_${deviceId}`);
    localdata.inputVideoFormat = result;

    if (!mongoSingle.set(`localdata_${deviceId}`, localdata)) {
        throw new Error();
    }
    return result;
};
