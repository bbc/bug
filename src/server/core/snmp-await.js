"use strict";

const snmp = require("net-snmp");
const obscure = require("@core/obscure-password");

module.exports = class SnmpAwait {
    constructor({ host, community = "public", timeout = 5000, port = 161 }) {
        console.log(`snmp-await: connecting to device at ${host}, community ${obscure(community)}, port ${port}`);
        this.session = snmp.createSession(host, community, {
            version: snmp.Version2c,
            timeout,
            port,
        });
    }

    session() {
        return this.session;
    }

    close() {
        if (this.session) this.session.close();
    }

    trimOid(oid) {
        return oid.length > 1 && oid.startsWith(".") ? oid.substring(1) : oid;
    }

    trimOids(oids) {
        return oids.map(this.trimOid.bind(this));
    }

    convertVarbind(varbind, raw = false) {
        if (raw) return varbind.value;

        switch (varbind.type) {
            case 1: return Boolean(varbind.value); // Boolean
            case 2: return parseInt(varbind.value); // Integer
            case 4: return varbind.value.toString(); // OctetString
            case 5: return null; // Null
            case 6: // OID
            case 64: // IP
            case 65: // Counter
            case 66: // Gauge
            case 67: // TimeTicks
            case 68: // Opaque
            case 70: // Counter64
                return varbind.value;
            case 128: // NoSuchObject
            case 129: // NoSuchInstance
            case 130: // EndOfMibView
                return null;
            default:
                return null;
        }
    }

    isMissing(varbind) {
        const str = typeof varbind === "string" ? varbind : "";
        return str.includes("NoSuchInstance") || str.includes("NoSuchObject");
    }

    get({ oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.session.get([self.trimOid(oid)], (error, varbinds) => {
                if (error) return reject(error);

                const vb = varbinds[0];
                if (snmp.isVarbindError(vb) && !(self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                    return reject(snmp.varbindError(vb));
                }

                resolve(self.convertVarbind(vb, raw));
            });
        });
    }

    getNext({ oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.session.getNext([self.trimOid(oid)], (error, varbinds) => {
                if (error) return reject(error);

                const vb = varbinds[0];
                if (snmp.isVarbindError(vb) && !(self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                    return reject(snmp.varbindError(vb));
                }

                resolve(self.convertVarbind(vb, raw));
            });
        });
    }

    walk({ maxRepetitions = 10, oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            const result = {};
            const addItem = (varbinds) => {
                for (const vb of varbinds) {
                    if (snmp.isVarbindError(vb) && !(self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                        console.error(snmp.varbindError(vb));
                    } else {
                        result[vb.oid] = self.convertVarbind(vb, raw);
                    }
                }
            };

            self.session.walk(self.trimOid(oid), maxRepetitions, addItem, (err) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    subtree({ maxRepetitions = 10, oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            const result = {};
            const addItem = (varbinds) => {
                for (const vb of varbinds) {
                    if (snmp.isVarbindError(vb) && !(self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                        console.error(snmp.varbindError(vb));
                    } else {
                        result[vb.oid] = self.convertVarbind(vb, raw);
                    }
                }
            };

            self.session.subtree(self.trimOid(oid), maxRepetitions, addItem, (err) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    checkExists({ oids }) {
        const self = this;
        return new Promise((resolve, reject) => {
            const results = [];
            self.session.get(self.trimOids(oids), (err, varbinds) => {
                if (err) return reject(err);

                for (const vb of varbinds) {
                    results.push({
                        oid: vb.oid,
                        isValid: !(snmp.isVarbindError(vb) && self.isMissing(snmp.varbindError(vb))),
                    });
                }
                resolve(results);
            });
        });
    }

    getMultiple({ oids = [], raw = false, ignoreMissing = false }) {
        const self = this;
        return new Promise((resolve, reject) => {
            const results = {};
            self.session.get(self.trimOids(oids), (err, varbinds) => {
                if (err) return reject(err);

                for (const vb of varbinds) {
                    if (!(snmp.isVarbindError(vb) && self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                        results[vb.oid] = self.convertVarbind(vb, raw);
                    }
                }
                resolve(results);
            });
        });
    }

    getSnmpObject(oid, value) {
        // Auto-detect type if value is an object
        let detectedType = typeof value;
        if (detectedType === "object" && value !== null) {
            detectedType = value?.type;
            value = value?.value;
        }

        switch (detectedType?.toLowerCase()) {
            case "string":
                return { oid, type: snmp.ObjectType.OctetString, value: value.toString() };

            case "octetstring":
                return { oid, type: snmp.ObjectType.OctetString, value };

            case "number":
            case "integer":
                return { oid, type: snmp.ObjectType.Integer, value: parseInt(value) };

            case "gauge":
                return { oid, type: snmp.ObjectType.Gauge, value: parseInt(value) };

            case "counter":
                return { oid, type: snmp.ObjectType.Counter, value: parseInt(value) };

            case "counter64":
                return { oid, type: snmp.ObjectType.Counter64, value: parseInt(value) };

            case "timerticks":
            case "timeticks":
                return { oid, type: snmp.ObjectType.TimeTicks, value: parseInt(value) };

            case "ipaddress":
                return { oid, type: snmp.ObjectType.IpAddress, value };

            case "oid":
                return { oid, type: snmp.ObjectType.OID, value };

            case "null":
                return { oid, type: snmp.ObjectType.Null, value: null };

            default:
                if (snmp.ObjectType[detectedType] !== undefined) {
                    return { oid, type: snmp.ObjectType[detectedType], value };
                }
                throw new Error(`snmp-await: unsupported SNMP type '${detectedType}' for OID ${oid}`);
        }
    }


    set({ oid, value }) {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                const varbinds = [self.getSnmpObject(self.trimOid(oid), value)];

                self.session.set(varbinds, function (error, responseVarbinds) {
                    if (error) {
                        return reject(error);
                    }

                    // check for SNMP varbind errors
                    for (const vb of responseVarbinds) {
                        if (snmp.isVarbindError(vb)) {
                            return reject(new Error(snmp.varbindError(vb)));
                        }
                    }

                    resolve(true);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    setMultiple({ values = [] }) {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                if (!Array.isArray(values) || values.length === 0) {
                    return resolve(true); // nothing to set
                }

                const varbinds = values.map(eachValue =>
                    self.getSnmpObject(self.trimOid(eachValue.oid), eachValue.value)
                );

                self.session.set(varbinds, function (error, responseVarbinds) {
                    if (error) {
                        return reject(error);
                    }

                    // check for SNMP varbind errors
                    for (const vb of responseVarbinds) {
                        if (snmp.isVarbindError(vb)) {
                            return reject(new Error(snmp.varbindError(vb)));
                        }
                    }

                    resolve(true);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    oidToMac(oid) {
        return oid
            .split(".")
            .map(val => parseInt(val).toString(16).padStart(2, "0"))
            .join(":")
            .toUpperCase();
    }
};
