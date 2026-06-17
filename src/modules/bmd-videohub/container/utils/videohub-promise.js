"use strict";

const net = require("net");
const util = require("util");
const events = require("events");
const ResponseBuffer = require("./videohub-response-buffer");

module.exports = Router;

function Router(opts) {
    this.opts = opts || {};
    this.socket = null;
    this.responseBuffer = null;
    this.pendingQueries = new Map();
    this.queryTimeout = 5000;
}

util.inherits(Router, events.EventEmitter);

Router.prototype.connect = function () {
    const instance = this;
    return new Promise((resolve, reject) => {
        if (!instance.opts.host) throw new Error("Please supply host parameter");
        if (!instance.opts.port) throw new Error("Please supply port parameter");

        instance.socket = net.createConnection(instance.opts.port, instance.opts.host);
        instance.socket.setTimeout(10000);

        instance.socket.on("connect", function () {
            instance.responseBuffer = new ResponseBuffer(instance.socket);

            instance.responseBuffer.on("block", function (block) {
                instance.handleBlockReceived(block);
            });

            instance.responseBuffer.on("error", function (error) {
                instance.emit("error", error);
            });

            resolve(instance.socket);
        });

        instance.socket.on("timeout", function () {
            reject(new Error("Connection timed out"));
        });

        instance.socket.on("error", function (error) {
            reject(new Error(error));
        });
    });
};

Router.prototype.handleBlockReceived = function (block) {
    const normalizedTitle = block.title.toLowerCase().replace(/\ /g, "_").trim();

    // Emit for legacy listener support (worker uses this)
    this.emit("update", [block]);

    // Check for pending queries waiting for this block
    if (this.pendingQueries.has(normalizedTitle)) {
        const { resolve } = this.pendingQueries.get(normalizedTitle);
        this.pendingQueries.delete(normalizedTitle);
        clearTimeout(this.pendingQueries.get(`${normalizedTitle}_timeout`));
        this.pendingQueries.delete(`${normalizedTitle}_timeout`);
        resolve(block);
    }
};

Router.prototype.query = function (field) {
    const instance = this;
    const normalizedField = field.toLowerCase().replace(/\ /g, "_").trim();

    return new Promise((resolve, reject) => {
        if (instance.pendingQueries.has(normalizedField)) {
            reject(new Error(`Query for "${field}" already pending`));
            return;
        }

        // Set up timeout
        const timeoutId = setTimeout(() => {
            instance.pendingQueries.delete(normalizedField);
            instance.pendingQueries.delete(`${normalizedField}_timeout`);
            reject(new Error(`Query for "${field}" timed out after ${instance.queryTimeout}ms`));
        }, instance.queryTimeout);

        instance.pendingQueries.set(normalizedField, { resolve, reject });
        instance.pendingQueries.set(`${normalizedField}_timeout`, timeoutId);

        instance.send(field).catch(reject);
    });
};

Router.prototype.queryBatch = function (fields) {
    const instance = this;
    // Chain queries sequentially to avoid interleaving responses
    return fields.reduce((promise, field) => {
        return promise.then((results) => {
            return instance.query(field).then((result) => {
                results.push(result);
                return results;
            });
        });
    }, Promise.resolve([]));
};

Router.prototype.send = function (field, command) {
    const instance = this;

    return new Promise((resolve, reject) => {
        try {
            let message = `${field}:\n`;
            if (command) {
                if (Array.isArray(command)) {
                    message += `${command.join("\n")}\n\n`;
                } else {
                    message += `${command}\n\n`;
                }
            } else {
                message += `\n`;
            }

            instance.socket.write(message, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

Router.prototype.disconnect = function () {
    const instance = this;
    return new Promise((resolve) => {
        if (instance.responseBuffer) {
            instance.responseBuffer.close();
            instance.responseBuffer = null;
        }

        if (instance.socket) {
            instance.socket.destroy();
            instance.socket = null;
        }

        // Clear pending queries
        instance.pendingQueries.forEach((value, key) => {
            if (!key.endsWith("_timeout") && value.reject) {
                value.reject(new Error("Connection closed"));
            }
        });
        instance.pendingQueries.clear();

        resolve();
    });
};
