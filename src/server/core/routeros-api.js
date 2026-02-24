"use strict";

const RosApi = require("node-routeros").RouterOSAPI;
const logger = require("@core/logger")(module);
const obscure = require("@core/obscure-password");

class RouterOSApi {
    constructor({
        host,
        user,
        password,
        timeout = 5,
        heartbeatInterval = 10,
        persistent = false,
        onDisconnect
    }) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.timeout = timeout;
        this.heartbeatInterval = heartbeatInterval;
        this.persistent = persistent;
        this.onDisconnect = onDisconnect;

        this.conn = new RosApi({
            host,
            user,
            password,
            timeout,
        });

        this._heartbeatTimer = null;
        this._busy = false;
        this._connecting = false;
    }

    async connect() {
        if (this.conn.connected) return this.conn;
        if (this._connecting) {
            await this._waitForConnection();
            return this.conn;
        }

        this._connecting = true;

        try {
            logger.info(
                `routeros-api: connecting to device at ${this.host} with username ${this.user}, password ${obscure(this.password)}`
            );
            await this._withTimeout(
                this.conn.connect(),
                this.timeout
            );
            logger.info(`routeros-api: connected OK to ${this.host}`);

            if (this.persistent) {
                logger.info(`routeros-api: starting heartbeat with interval ${this.heartbeatInterval}s to ${this.host}`);
                this._startHeartbeat();
            }

            return this.conn;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect() {
        if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = null;
            logger.info(`routeros-api: stopped heartbeat interval from ${this.host}`);
        }

        if (this.conn && this.conn.connected) {
            await this.conn.close();
            logger.info(`routeros-api: disconnected from ${this.host}`);
        }
    }

    async run(command, params = {}) {
        await this.connect();

        if (this._busy) {
            await this._waitUntilFree();
        }

        this._busy = true;

        try {
            const result = await this._withTimeout(
                this.conn.write(command, params),
                this.timeout
            );

            return result;
        } catch (err) {
            // RouterOS sometimes drops connections silently
            if (this.persistent && this.onDisconnect) {
                this.onDisconnect(err);
            }
            throw err;
        } finally {
            this._busy = false;

            if (!this.persistent) {
                await this.disconnect();
            }
        }
    }

    _startHeartbeat() {
        if (!this.heartbeatInterval) return;
        if (this._heartbeatTimer) return;

        this._heartbeatTimer = setInterval(() => {
            logger.debug(`routeros-api: performing heartbeat check to ${this.host}`);
            this._heartbeatCheck();
        }, this.heartbeatInterval * 1000);
    }

    async _heartbeatCheck() {
        if (!this.conn.connected) return;
        if (this._busy) return;

        try {
            await this._withTimeout(
                this.conn.write("/system/identity/print"),
                3
            );
        } catch (err) {
            logger.warning(`routeros-api: failed heartbeat check to ${this.host}`);
            await this._handleDisconnect(err);
        }
    }

    async _handleDisconnect(err) {
        if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = null;
        }

        try {
            if (this.conn.connected) {
                await this.conn.close();
            }
        } catch { }

        if (this.onDisconnect) {
            this.onDisconnect(err);
        }
    }

    _withTimeout(promise, seconds) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(
                () => reject(new Error(`RouterOS call timed out after ${seconds}s`)),
                seconds * 1000
            );

            promise
                .then(res => {
                    clearTimeout(timer);
                    resolve(res);
                })
                .catch(err => {
                    clearTimeout(timer);
                    reject(err);
                });
        });
    }

    _waitUntilFree() {
        return new Promise(resolve => {
            const check = () => {
                if (!this._busy) return resolve();
                setTimeout(check, 10);
            };
            check();
        });
    }

    _waitForConnection() {
        return new Promise(resolve => {
            const check = () => {
                if (!this._connecting) return resolve();
                setTimeout(check, 10);
            };
            check();
        });
    }
}

module.exports = RouterOSApi;