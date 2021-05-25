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
            instance.emit("update", parser(data.toString()));
        });

        instance.socket.on("connect", function () {
            resolve(instance.socket);
        });

        instance.socket.on("timeout", function () {
            reject(new Error("Connected timed out"));
        });

        instance.socket.on("error", function (error) {
            reject(new Error(e));
        });
    });
};

// Router.prototype.disconnect = function () {
//     return new Promise((resolve, reject) => {
//         console.log("end");
//         this.socket.end();

//         this.socket.on("end", function () {
//             console.log(`videohub-promise: ENDED`);
//             resolve();
//         });

//         this.socket.on("timeout", function (e) {
//             console.log(`videohub-promise: TIMEOUT`);
//             reject(new Error("Connected timed out"));
//         });

//         this.socket.on("error", function (e) {
//             console.log(`videohub-promise: ERROR`);
//             reject(new Error(e));
//         });
//     });
// };

Router.prototype.route = function (output, input) {
    const instance = this;
    return new Promise((resolve, reject) => {
        let str = [`VIDEO OUTPUT ROUTING:`, `${output} ${input}`].join("\n");
        str += "\n\n";

        try {
            instance.socket.write(str, () => {
                setTimeout(() => {
                    resolve();
                }, 100);
            });
        } catch (error) {
            reject(new Error(error));
        }
    });
};
