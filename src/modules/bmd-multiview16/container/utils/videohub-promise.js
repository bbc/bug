"use strict";
const net = require("net");
const util = require("util");
const events = require("events");
const _ = require("underscore");
const parser = require("./videohub-parser");

module.exports = Router;

function Router(opts) {
    this.opts = opts || {};

    this.socket = null;
}

util.inherits(Router, events.EventEmitter);

Router.prototype.connect = function () {
    const instance = this;
    return new Promise((resolve, reject) => {
        if (!instance.opts.host) throw new Error("Please supply host parameter");
        if (!instance.opts.port) throw new Error("Please supply port parameter");

        instance.socket = net.createConnection(instance.opts.port, instance.opts.host);

        instance.socket.on("data", function (data) {
            try {
                instance.emit("update", parser(data.toString()));
            } catch (error) {}
        });

        instance.socket.on("connect", function () {
            resolve(instance.socket);
        });

        instance.socket.on("timeout", function () {
            reject(new Error("Connected timed out"));
        });

        instance.socket.on("error", function (error) {
            reject(new Error(error));
        });
    });
};

Router.prototype.send = function (field, command, log = false) {
    const instance = this;

    return new Promise((resolve, reject) => {
        try {
            let message = `${field}:\n`;
            if (command) {
                message += `${command}\n\n`;
            } else {
                message += `\n`;
            }
            if (log) {
                console.log(`videohub-promise: sending ${JSON.stringify(message)}`);
            }
            instance.socket.write(message, () => {
                setTimeout(() => {
                    resolve();
                }, 100);
            });
        } catch (error) {
            reject(new Error(error));
        }
    });
};
