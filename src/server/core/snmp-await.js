"use strict";

const snmp = require("net-snmp");
const obscure = require("@core/obscure-password");

module.exports = class SnmpAwait {
    constructor({ host, community = "public", timeout = 5000, port = 161 }) {

        console.log(`snmp-await: connecting to device at ${host}, community ${obscure(community)}, port ${port}`);
        this.session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout: timeout,
            port: port,
        });
    }

    session() {
        return this.session;
    }

    close() {
        if (this.session !== undefined) {
            this.session.close();
        }
    }

    trimOid(oid) {
        if (oid.length > 1 && oid.indexOf(".") === 0) {
            return oid.substring(1);
        }
        return oid;
    }

    trimOids(oids) {
        const retArray = [];
        for (let eachOid of oids) {
            retArray.push(this.trimOid(eachOid));
        }
        return retArray;
    }

    convertVarbind(varbind, raw = false) {
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
    }

    isMissing(varbind) {
        return varbind.indexOf("NoSuchInstance") > -1 || varbind.indexOf("NoSuchObject") > -1;
    }

    get({ oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            let returnValue = null;

            self.session.get([self.trimOid(oid)], function (error, varbinds) {
                if (error) {
                    console.error(error);
                    reject();
                } else {
                    if (
                        snmp.isVarbindError(varbinds[0]) &&
                        !(self.isMissing(snmp.varbindError(varbinds[0])) && ignoreMissing)
                    ) {
                        console.error(snmp.varbindError(varbinds[0]));
                        reject();
                    } else {
                        returnValue = self.convertVarbind(varbinds[0], raw);
                    }
                }
                resolve(returnValue);
            });
        });
    }

    getNext({ oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.session.getNext([self.trimOid(oid)], function (error, varbinds) {
                if (error) {
                    console.error(error);
                    reject();
                } else {
                    if (
                        snmp.isVarbindError(varbinds[0]) &&
                        !(self.isMissing(snmp.varbindError(varbinds[0])) && ignoreMissing)
                    ) {
                        console.error(snmp.varbindError(varbinds[0]));
                        reject();
                    }
                }
                resolve(self.convertVarbind(varbinds[0], raw));
            });
        });
    }

    walk({ maxRepetitions = 10, oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            let returnValues = {};

            const addItem = (varbinds) => {
                for (var i = 0; i < varbinds.length; i++) {
                    if (
                        snmp.isVarbindError(varbinds[i]) &&
                        !(self.isMissing(snmp.varbindError(varbinds[0])) && ignoreMissing)
                    ) {
                        console.error(snmp.varbindError(varbinds[i]));
                    } else {
                        returnValues[varbinds[i].oid] = self.convertVarbind(varbinds[i], raw);
                    }
                }
            };

            self.session.walk(self.trimOid(oid), maxRepetitions, addItem, (error) => {
                if (error) {
                    console.error(error);
                    reject();
                } else {
                    resolve(returnValues);
                }
            });
        });
    }

    checkExists({ oids }) {
        const self = this;
        return new Promise((resolve, reject) => {
            let returnValues = [];

            self.session.get(self.trimOids(oids), function (error, varbinds) {
                if (error) {
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
                resolve(returnValues);
            });
        });
    }

    subtree({ maxRepetitions = 10, oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            let returnValues = {};

            const addItem = (varbinds) => {
                for (var i = 0; i < varbinds.length; i++) {
                    if (
                        snmp.isVarbindError(varbinds[i]) &&
                        !(self.isMissing(snmp.varbindError(varbinds[0])) && ignoreMissing)
                    ) {
                        console.error(snmp.varbindError(varbinds[i]));
                    } else {
                        returnValues[varbinds[i].oid] = self.convertVarbind(varbinds[i], raw);
                    }
                }
            };

            self.session.subtree(self.trimOid(oid), maxRepetitions, addItem, (error) => {
                if (error) {
                    console.error(error);
                    reject();
                } else {
                    resolve(returnValues);
                }
            });
        });
    }

    getMultiple({ oids = [], raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            let returnValues = {};
            self.session.get(self.trimOids(oids), function (error, varbinds) {
                if (error) {
                    console.error(error);
                    reject();
                } else {
                    for (var i = 0; i < varbinds.length; i++) {
                        if (
                            snmp.isVarbindError(varbinds[i]) &&
                            !(self.isMissing(snmp.varbindError(varbinds[0])) && ignoreMissing)
                        ) {
                            console.error(snmp.varbindError(varbinds[i]));
                        } else {
                            returnValues[varbinds[i].oid] = self.convertVarbind(varbinds[i], raw);
                        }
                    }
                }
                resolve(returnValues);
            });
        });
    }

    getSnmpObject(oid, value) {
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
            case "octetstring":
                return {
                    oid: oid,
                    type: snmp.ObjectType.OctetString,
                    value: value,
                };
            case "number":
                return {
                    oid: oid,
                    type: snmp.ObjectType.Integer,
                    value: parseInt(value),
                };
            case "gauge":
                return {
                    oid: oid,
                    type: snmp.ObjectType.Gauge,
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
    }

    // this accepts an array of objects, each with an oid and value
    // remember the value can itself be an object containing a type and value - see getSnmpObject
    setMultiple({ values = [], timeout = 5000 }) {
        const self = this;
        return new Promise((resolve, reject) => {
            const varbinds = [];
            for (let eachValue of values) {
                varbinds.push(self.getSnmpObject(self.trimOid(eachValue.oid), eachValue.value));
            }

            self.session.set(varbinds, function (error, varbinds) {
                if (error) {
                    console.error(error);
                    reject();
                } else {
                    for (var i = 0; i < varbinds.length; i++) {
                        if (snmp.isVarbindError(varbinds[i])) {
                            reject();
                        }
                    }
                }
                resolve(true);
            });
        });
    }

    // the value here can be an object containing a type and value - see getSnmpObject
    set({ oid, value }) {
        const self = this;
        return new Promise((resolve, reject) => {
            const varbinds = [self.getSnmpObject(self.trimOid(oid), value)];
            self.session.set(varbinds, function (error, varbinds) {
                if (error) {
                    console.error(error);
                    reject();
                } else {
                    for (var i = 0; i < varbinds.length; i++) {
                        if (snmp.isVarbindError(varbinds[i])) {
                            reject();
                        }
                    }
                }
                resolve(true);
            });
        });
    }

    oidToMac(oid) {
        const valArray = oid.split(".");
        const macArray = [];
        for (const eachVal of valArray) {
            macArray.push(parseInt(eachVal).toString(16).padStart(2, "0"));
        }
        return macArray.join(":").toUpperCase();
    }
};
