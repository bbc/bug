"use strict";
const net = require("net");
const events = require("events");
const parser = require("./videohub-parser");

class Router extends events.EventEmitter {
    constructor(opts = {}) {
        super();
        this.opts = opts;
        this.socket = null;
    }

    async connect() {
        if (!this.opts.host) throw new Error("Please supply host parameter");
        if (!this.opts.port) throw new Error("Please supply port parameter");

        if (this.socket && !this.socket.destroyed) {
            // already connected
            return this.socket;
        }

        return new Promise((resolve, reject) => {
            this.socket = net.createConnection(this.opts.port, this.opts.host);

            this.socket.on("data", (data) => {
                try {
                    this.emit("update", parser(data.toString()));
                } catch (err) {
                    this.emit("error", err);
                }
            });

            this.socket.on("connect", () => resolve(this.socket));

            this.socket.on("timeout", () => reject(new Error("Connection timed out")));
            this.socket.setTimeout(this.opts.timeout || 5000);

            this.socket.on("error", (err) => reject(err));
        });
    }

    async send(field, command, log = false) {
        if (!this.socket || this.socket.destroyed) {
            throw new Error("Socket is not connected");
        }

        return new Promise((resolve, reject) => {
            try {
                let message = `${field}:\n`;
                if (command) message += `${command}\n\n`;
                else message += `\n`;

                if (log) console.log(`videohub-promise: sending ${JSON.stringify(message)}`);

                this.socket.write(message, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = Router;
