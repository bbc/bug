"use strict";

const { RouterOSAPI } = require("node-routeros-v2");
const logger = require("@core/logger")(module);
const obscure = require("@core/obscure-password");

class RouterOSApi {
    constructor({
        host,
        user,
        password,
        timeout = 30,
        keepalive = false,
        heartbeatInterval = 10,
        onDisconnect
    }) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.timeout = timeout;
        this.keepalive = keepalive;
        this.heartbeatInterval = heartbeatInterval;
        this.onDisconnect = onDisconnect;

        this.conn = new RouterOSAPI({
            host,
            user,
            password,
            timeout,
            keepalive
        });

        this._connecting = false;
        this._queue = Promise.resolve();
        this._heartbeatTimer = null;
        this._heartbeatInFlight = false;
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
                `routeros-api: connecting to ${this.host} user=${this.user} password=${obscure(this.password)}`
            );

            await this._withTimeout(this.conn.connect(), this.timeout);

            logger.info(`connected to ${this.host}`);

            if (this.keepalive && this.heartbeatInterval > 0) {
                this._startHeartbeat();
            }

            return this.conn;
        } catch (err) {
            throw err;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect() {
        if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = null;
            logger.info(`stopped heartbeat for ${this.host}`);
        }

        if (this.conn?.connected) {
            try {
                await this.conn.close();
                logger.info(`disconnected from ${this.host}`);
            } catch (err) {
                logger.warning(`disconnect error from ${this.host}`);
            }
        }
    }

    async run(command, params = {}) {
        // queue commands so RouterOS API never overlaps
        // use .catch(() => {}) to prevent a failed command from poisoning the queue
        // and blocking all subsequent commands
        logger.debug(`queueing command ${command} with params ${JSON.stringify(params)} for ${this.host}`);
        const next = this._queue.catch(() => { }).then(() => this._execute(command, params));
        this._queue = next;
        return next;
    }

    async _execute(command, params) {
        await this.connect();

        try {
            return await this._withTimeout(
                this.conn.write(command, params),
                this.timeout
            );
        } catch (err) {
            logger.warning(`command failed ${command} on ${this.host}`);

            try {
                if (this.conn.connected) await this.conn.close();
            } catch { }

            if (this.onDisconnect) this.onDisconnect(err);
            throw err;
        } finally {
            if (!this.keepalive) await this.disconnect();
        }
    }

    _startHeartbeat() {
        if (this._heartbeatTimer) return;

        logger.info(`heartbeat started (${this.heartbeatInterval}s) for ${this.host}`);

        this._heartbeatTimer = setInterval(async () => {
            if (!this.conn.connected || this._heartbeatInFlight) return;

            this._heartbeatInFlight = true;

            try {
                await this.run("/system/identity/print");
                logger.debug(`heartbeat OK for ${this.host}`);
            } catch (err) {
                logger.warning(`heartbeat failed for ${this.host}`);
            } finally {
                this._heartbeatInFlight = false;
            }
        }, this.heartbeatInterval * 1000);
    }

    _withTimeout(promise, seconds) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`RouterOS call timed out after ${seconds}s (${this.host})`));
            }, seconds * 1000);

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

    _waitForConnection() {
        return new Promise(resolve => {
            const check = () => {
                if (!this._connecting) return resolve();
                setTimeout(check, 20);
            };
            check();
        });
    }
}

module.exports = RouterOSApi;