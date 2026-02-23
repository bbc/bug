"use strict";

const RosApi = require("node-routeros").RouterOSAPI;

class RouterOSApi {
    constructor({ host, user, password, timeout = 2, heartbeatInterval = 5, onDisconnect }) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.timeout = timeout;
        this.heartbeatInterval = heartbeatInterval;
        this.onDisconnect = onDisconnect;
        this.conn = new RosApi({
            host,
            user,
            password,
            timeout,
        });
        this._heartbeatTimer = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`RouterOS connection timed out after ${this.timeout}s`));
            }, this.timeout * 1000);

            this.conn.connect()
                .then(() => {
                    clearTimeout(timer);
                    this._startHeartbeat();
                    resolve(this.conn);
                })
                .catch(err => {
                    clearTimeout(timer);
                    reject(err);
                });
        });
    }

    async disconnect() {
        if (this.conn) {
            await this.conn.close();
        }
    }

    _startHeartbeat() {
        if (!this.onDisconnect) return;
        if (!this.heartbeatInterval) return;

        this._heartbeatTimer = setInterval(() => {
            this._heartbeatCheck();
        }, this.heartbeatInterval * 1000);
    }

    async _heartbeatCheck() {
        try {
            await this._withTimeout(this.conn.write('/system/resource/print'), 2)
        } catch (err) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = null;
            if (this.onDisconnect) this.onDisconnect(err);
        }
    }

    _withTimeout(promise, seconds) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(`RouterOS call timed out after ${seconds}s`)), seconds * 1000);
            promise
                .then(r => { clearTimeout(timer); resolve(r); })
                .catch(e => { clearTimeout(timer); reject(e); });
        });
    }

}

module.exports = RouterOSApi;
