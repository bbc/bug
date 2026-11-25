"use strict";

const snmp = require("net-snmp");
const SnmpAwait = require("@core/snmp-await");
const logger = require("@core/logger")(module);

module.exports = class CiscoSGSnmp extends SnmpAwait {
    constructor({ host, community }) {
        super({ host, community, timeout: 5000 });
        this.pending = [];
        this.running = false;
    }

    createSession() {
        logger.debug("creating SNMP polling session");
        this.session = snmp.createSession(this.host, this.community, {
            version: snmp.Version2c,
            timeout: this.timeout,
            retries: 0,
            port: this.port,
        });
    }

    withReconnectRetry(executor) {
        return executor(this.session);
    }

    enqueue(operation, priority = false) {
        return new Promise((resolve, reject) => {
            const job = { operation, resolve, reject };
            if (priority) {
                this.pending.unshift(job);
            } else {
                this.pending.push(job);
            }
            this.runNext();
        });
    }

    async runNext() {
        if (this.running || !this.pending.length) return;

        const job = this.pending.shift();
        this.running = true;
        try {
            const session = this.session;
            let expired = false;
            let timer;
            const deadline = new Promise((resolve, reject) => {
                timer = setTimeout(() => {
                    expired = true;
                    try {
                        session.close();
                    } catch (error) {
                        reject(error);
                        return;
                    }
                    reject(new Error("SNMP polling operation exceeded 15 seconds"));
                }, 15000);
            });

            try {
                job.resolve(await Promise.race([job.operation(), deadline]));
            } catch (error) {
                if (expired || error?.code === "ERR_SOCKET_DGRAM_NOT_RUNNING" ||
                    (error?.message || "").includes("Socket forcibly closed")) {
                    this.createSession();
                }
                job.reject(error);
            } finally {
                clearTimeout(timer);
            }
        } catch (error) {
            job.reject(error);
        } finally {
            this.running = false;
            this.runNext();
        }
    }

    get(options) {
        return this.enqueue(() => super.get(options), options.priority);
    }

    getMultiple(options) {
        return this.enqueue(() => super.getMultiple(options));
    }

    subtree(options) {
        return this.enqueue(() => super.subtree(options));
    }

    subtreeNext({ oid, maxIndexExclusive, firstOnly = false }) {
        return this.enqueue(async () => {
            const session = this.session;
            const root = this.trimOid(oid);
            const results = {};
            let current = root;

            while (true) {
                const getNext = () => new Promise((resolve, reject) => {
                    session.getNext([current], (error, values) => error ? reject(error) : resolve(values));
                });
                let varbinds;
                try {
                    varbinds = await getNext();
                } catch (error) {
                    if (!(error instanceof snmp.RequestTimedOutError)) throw error;
                    logger.warning(`GETNEXT timed out for ${current}; retrying once`);
                    varbinds = await getNext();
                }
                const varbind = varbinds?.[0];
                if (!varbind) throw new Error(`GETNEXT returned no value for ${current}`);
                if (varbind.type === snmp.ObjectType.EndOfMibView) break;
                if (snmp.isVarbindError(varbind)) throw new Error(snmp.varbindError(varbind));
                if (!varbind.oid.startsWith(`${root}.`)) break;
                if (maxIndexExclusive !== undefined) {
                    const index = varbind.oid.slice(root.length + 1);
                    if (!/^\d+$/.test(index)) throw new Error(`Invalid index in OID ${varbind.oid}`);
                    if (Number(index) >= maxIndexExclusive) break;
                }

                results[varbind.oid] = this.convertVarbind(varbind);
                if (firstOnly) break;
                current = varbind.oid;
            }

            return results;
        });
    }
};
