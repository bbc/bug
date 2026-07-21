"use strict";

const snmp = require("net-snmp");
const obscure = require("@core/obscure-password");
const logger = require("@core/logger")(module);

module.exports = class SnmpAwait {
    constructor({ host, community = "public", timeout = 5000, port = 161 }) {
        this.host = host;
        this.community = community;
        this.timeout = timeout;
        this.port = port;
        this.session = null;
        this.reconnectPromise = null;
        this.createSession();
    }

    createSession() {
        if (this.session) {
            try {
                this.session.close();
            } catch (error) {
                // Ignore close errors while rebuilding session.
            }
        }

        logger.info(`connecting to device at ${this.host}, community ${obscure(this.community)}, port ${this.port}`);
        this.session = snmp.createSession(this.host, this.community, {
            version: snmp.Version2c,
            timeout: this.timeout,
            port: this.port,
        });
    }

    shouldReconnect(error) {
        const errorText = (error?.message || error || "").toString();
        return errorText.includes("Request timed out") || errorText.includes("Socket forcibly closed");
    }

    async recreateSessionSerial() {
        if (this.reconnectPromise) {
            await this.reconnectPromise;
            return;
        }

        this.reconnectPromise = Promise.resolve()
            .then(() => {
                this.createSession();
            })
            .finally(() => {
                this.reconnectPromise = null;
            });

        await this.reconnectPromise;
    }

    async withReconnectRetry(executor) {
        try {
            return await executor();
        } catch (error) {
            if (!this.shouldReconnect(error)) {
                throw error;
            }

            logger.warning("SNMP request failed, recreating session and retrying once");
            await this.recreateSessionSerial();
            return await executor();
        }
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
        return self.withReconnectRetry(
            () => new Promise((resolve, reject) => {
                self.session.get([self.trimOid(oid)], (error, varbinds) => {
                    if (error) return reject(error);

                    const vb = varbinds[0];
                    if (snmp.isVarbindError(vb) && !(self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                        return reject(snmp.varbindError(vb));
                    }

                    resolve(self.convertVarbind(vb, raw));
                });
            })
        );
    }

    getNext({ oid, raw = false, ignoreMissing = false }) {
        const self = this;
        return self.withReconnectRetry(
            () => new Promise((resolve, reject) => {
                self.session.getNext([self.trimOid(oid)], (error, varbinds) => {
                    if (error) return reject(error);

                    const vb = varbinds[0];
                    if (snmp.isVarbindError(vb) && !(self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                        return reject(snmp.varbindError(vb));
                    }

                    resolve(self.convertVarbind(vb, raw));
                });
            })
        );
    }

    walk({ oid, maxRepetitions = 10, raw = false, ignoreMissing = false }) {
        const self = this;
        return self.withReconnectRetry(
            () => new Promise((resolve, reject) => {
                const result = {};

                const feedVarbinds = (varbinds) => {
                    for (const vb of varbinds) {
                        if (snmp.isVarbindError(vb)) {
                            const errMsg = snmp.varbindError(vb);
                            if (self.isMissing(errMsg) && ignoreMissing) {
                                continue;
                            } else {
                                console.warn(`snmp-await: walk varbind error on ${vb.oid}: ${errMsg}`);
                                continue;
                            }
                        }
                        result[vb.oid] = self.convertVarbind(vb, raw);
                    }
                };

                self.session.walk(self.trimOid(oid), maxRepetitions, feedVarbinds, (err) => {
                    if (err) {
                        return reject(new Error(`walk session error: ${err.message || err}`));
                    }
                    resolve(result);
                });
            })
        );
    }

    subtree({ oid, maxRepetitions = 5, raw = false, ignoreMissing = false }) {
        const self = this;
        return self.withReconnectRetry(
            () => new Promise((resolve, reject) => {
                const result = {};

                const feedVarbinds = (varbinds) => {
                    for (const vb of varbinds) {
                        if (snmp.isVarbindError(vb)) {
                            const errMsg = snmp.varbindError(vb);
                            if (self.isMissing(errMsg) && ignoreMissing) continue;
                            console.warn(`snmp-await: subtree varbind error on ${vb.oid}: ${errMsg}`);
                            continue;
                        }
                        result[vb.oid] = self.convertVarbind(vb, raw);
                    }
                };

                self.session.subtree(self.trimOid(oid), maxRepetitions, feedVarbinds, (err) => {
                    if (err) {
                        return reject(new Error(`subtree session error: ${err.message || err}`));
                    }
                    resolve(result);
                });
            })
        );
    }

    checkExists({ oids }) {
        const self = this;
        return self.withReconnectRetry(
            () => new Promise((resolve, reject) => {
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
            })
        );
    }

    getMultiple({ oids = [], raw = false, ignoreMissing = false, chunkSize = 0 }) {
        const self = this;

        if (!Array.isArray(oids) || !oids.length) {
            return Promise.resolve({});
        }

        const normalizedChunkSize = Number.isInteger(chunkSize) && chunkSize > 0 ? chunkSize : 0;

        const fetchChunk = (chunkOids) => new Promise((resolve, reject) => {
            const chunkResults = {};
            self.session.get(self.trimOids(chunkOids), (err, varbinds) => {
                if (err) return reject(err);

                for (const vb of varbinds) {
                    if (!(snmp.isVarbindError(vb) && self.isMissing(snmp.varbindError(vb)) && ignoreMissing)) {
                        chunkResults[vb.oid] = self.convertVarbind(vb, raw);
                    }
                }

                resolve(chunkResults);
            });
        });

        if (normalizedChunkSize === 0) {
            return self.withReconnectRetry(() => fetchChunk(oids));
        }

        return self.withReconnectRetry(async () => {
            const results = {};
            for (let i = 0; i < oids.length; i += normalizedChunkSize) {
                const chunkOids = oids.slice(i, i + normalizedChunkSize);
                const chunkResults = await fetchChunk(chunkOids);
                Object.assign(results, chunkResults);
            }
            return results;
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
                return reject(new Error(`unsupported SNMP type '${detectedType}' for OID ${oid}`));
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
