"use strict";
const snmp = require("net-snmp");
const chunk = require("@core/chunk");

const hex2bin = (hex) => {
    return parseInt(hex, 16).toString(2).padStart(8, "0");
};

const get = ({ host, community = "public", oid, timeout = 5000, raw = false }) => {
    return new Promise((resolve, reject) => {
        var session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });
        let returnValue = null;

        session.get([trimOid(oid)], function (error, varbinds) {
            if (error) {
                session.close();
                console.error(error);
                reject();
            } else {
                if (snmp.isVarbindError(varbinds[0])) {
                    console.error(snmp.varbindError(varbinds[0]));
                    reject();
                } else {
                    returnValue = convertVarbind(varbinds[0], raw);
                }
            }
            session.close();
            resolve(returnValue);
        });
    });
};

const getNext = ({ host, community = "public", oid, timeout = 5000, raw = false }) => {
    return new Promise((resolve, reject) => {
        var session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });
        session.getNext([trimOid(oid)], function (error, varbinds) {
            if (error) {
                session.close();
                console.error(error);
                reject();
            } else {
                if (snmp.isVarbindError(varbinds[0])) {
                    console.error(snmp.varbindError(varbinds[0]));
                    reject();
                }
            }
            session.close();
            resolve(convertVarbind(varbinds[0], raw));
        });
    });
};

const walk = ({ host, community = "public", maxRepetitions = 10, oid, timeout = 5000, raw = false }) => {
    return new Promise((resolve, reject) => {
        let returnValues = {};

        var session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });

        const addItem = (varbinds) => {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i])) {
                    console.error(snmp.varbindError(varbinds[i]));
                } else {
                    returnValues[varbinds[i].oid] = convertVarbind(varbinds[i], raw);
                }
            }
        };

        session.walk(trimOid(oid), maxRepetitions, addItem, (error) => {
            if (error) {
                console.error(error);
                reject();
            } else {
                session.close();
                resolve(returnValues);
            }
        });
    });
};

const checkExists = ({ host, community = "public", maxRepetitions = 10, oids, timeout = 5000 }) => {
    return new Promise((resolve, reject) => {
        let returnValues = [];

        var session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });

        session.get(trimOids(oids), function (error, varbinds) {
            if (error) {
                session.close();
                console.error(error);
                reject();
            } else {
                for (var i = 0; i < varbinds.length; i++) {
                    if (
                        snmp.isVarbindError(varbinds[i]) &&
                        snmp.varbindError(varbinds[i]).indexOf("NoSuchInstance") > -1
                    ) {
                        returnValues.push({
                            oid: varbinds[i].oid,
                            isValid: false,
                        });
                    } else {
                        returnValues.push({
                            oid: varbinds[i].oid,
                            isValid: true,
                        });
                    }
                }
            }
            session.close();
            resolve(returnValues);
        });
    });
};

const subtree = ({ host, community = "public", maxRepetitions = 10, oid, timeout = 5000, raw = false }) => {
    return new Promise((resolve, reject) => {
        let returnValues = {};

        var session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });

        const addItem = (varbinds) => {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i])) {
                    console.error(snmp.varbindError(varbinds[i]));
                } else {
                    returnValues[varbinds[i].oid] = convertVarbind(varbinds[i], raw);
                }
            }
        };

        session.subtree(trimOid(oid), maxRepetitions, addItem, (error) => {
            if (error) {
                console.error(error);
                reject();
            } else {
                session.close();
                resolve(returnValues);
            }
        });
    });
};

const getMultiple = ({ host, community = "public", oids = [], timeout = 5000, raw = false }) => {
    return new Promise((resolve, reject) => {
        let returnValues = {};

        var session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });

        session.get(trimOids(oids), function (error, varbinds) {
            if (error) {
                session.close();
                console.error(error);
                reject();
            } else {
                for (var i = 0; i < varbinds.length; i++) {
                    if (snmp.isVarbindError(varbinds[i])) {
                        console.error(snmp.varbindError(varbinds[i]));
                    } else {
                        returnValues[varbinds[i].oid] = convertVarbind(varbinds[i], raw);
                    }
                }
            }
            session.close();
            resolve(returnValues);
        });
    });
};

const getSnmpObject = (oid, value) => {
    // we do some cunning auto-detection.
    // if it's an object then we expect the type to be passed

    let detectedType = typeof value;
    if (detectedType === "object") {
        detectedType = value?.type;
        value = value?.value;
    }

    switch (detectedType) {
        case "string":
            return {
                oid: oid,
                type: snmp.ObjectType.OctetString,
                value: value.toString(),
            };
        case "number":
            return {
                oid: oid,
                type: snmp.ObjectType.Integer,
                value: parseInt(value),
            };
        default:
            if (snmp.ObjectType[detectedType] !== undefined) {
                return {
                    oid: oid,
                    type: snmp.ObjectType[detectedType],
                    value: value,
                };
            }
            console.error(`snmp-await: unsupported type '${detectedType}'`);
            return null;
    }
};

// this accepts an array of objects, each with an oid and value
// remember the value can itself be an object containing a type and value - see getSnmpObject
const setMultiple = ({ host, community = "public", values = [], timeout = 5000 }) => {
    return new Promise((resolve, reject) => {
        const session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });

        const varbinds = [];
        for (let eachValue of values) {
            varbinds.push(getSnmpObject(trimOid(eachValue.oid), eachValue.value));
        }

        session.set(varbinds, function (error, varbinds) {
            if (error) {
                session.close();
                console.error(error);
                reject();
            } else {
                for (var i = 0; i < varbinds.length; i++) {
                    if (snmp.isVarbindError(varbinds[i])) {
                        session.close();
                        reject();
                    }
                }
            }
            session.close();
            resolve(true);
        });
    });
};

// the value here can be an object containing a type and value - see getSnmpObject
const set = ({ host, community = "public", oid, value, timeout = 5000 }) => {
    return new Promise((resolve, reject) => {
        const session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
        });

        const varbinds = [getSnmpObject(trimOid(oid), value)];
        console.log(varbinds);
        session.set(varbinds, function (error, varbinds) {
            if (error) {
                session.close();
                console.error(error);
                reject();
            } else {
                for (var i = 0; i < varbinds.length; i++) {
                    if (snmp.isVarbindError(varbinds[i])) {
                        session.close();
                        reject();
                    }
                }
            }
            session.close();
            resolve(true);
        });
    });
};

const trimOid = (oid) => {
    if (oid.length > 1 && oid.indexOf(".") === 0) {
        return oid.substring(1);
    }
    return oid;
};

const trimOids = (oids) => {
    const retArray = [];
    for (let eachOid of oids) {
        retArray.push(trimOid(eachOid));
    }
    return retArray;
};

const convertVarbind = (varbind, raw = false) => {
    if (raw) {
        return varbind.value;
    }
    switch (varbind.type) {
        case 1: // Boolean
            return new Boolean(varbind.value);
        case 2: // Integer
            return parseInt(varbind.value);
        case 4: // OctetString
            return varbind.value.toString();
        case 5: // Null
            return null;
        case 6: // OID
            return varbind.value;
        case 64: // IP address
            return varbind.value;
        case 65: // Counter
            return varbind.value;
        case 66: // Gauge
            return varbind.value;
        case 67: // TimeTicks
            return varbind.value;
        case 68: // Opaque
            return varbind.value;
        case 70: // Counter64
            return varbind.value;
        case 128: // NoSuchObject
            return null;
        case 129: // NoSuchInstance
            return null;
        case 130: // EndOfMibView
            return null;
        default:
            return null;
    }
};

const oidToMac = (oid) => {
    const valArray = oid.split(".");
    const macArray = [];
    for (const eachVal of valArray) {
        macArray.push(parseInt(eachVal).toString(16).padStart(2, "0"));
    }
    return macArray.join(":").toUpperCase();
};

module.exports = {
    get: get,
    set: set,
    setMultiple: setMultiple,
    getNext: getNext,
    walk: walk,
    subtree: subtree,
    getMultiple: getMultiple,
    oidToMac: oidToMac,
    checkExists: checkExists,
};
