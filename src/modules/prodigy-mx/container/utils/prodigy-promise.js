"use strict";
const net = require("net");
const util = require("util");
const events = require("events");

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

        let dataString = "";

        instance.socket = net.createConnection(instance.opts.port, instance.opts.host);

        instance.socket.on("data", function (data) {
            dataString += data.toString();
            if (data.indexOf("\n") > -1) {
                try {
                    const parsedData = JSON.parse(dataString);
                    if (parsedData?.type === "update") {
                        instance.emit("update", parsedData?.["payload"]);
                    } else if (parsedData?.type === "get_resp") {
                        instance.emit("update", parsedData?.["payload"]);
                    } else if (parsedData?.type === "error") {
                        instance.emit("error", parsedData?.["payload"]);
                    } else if (parsedData?.type === "ack") {
                        instance.emit("ack", parsedData);
                    } else {
                        console.log(`prodify-promise: unknown response`, parsedData);
                    }
                } catch (error) {
                    console.error(`prodigy-promise: could not decode JSON response`);
                }

                dataString = "";
            }
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

Router.prototype.send = function (command, log = false) {
    const instance = this;

    return new Promise((resolve, reject) => {
        try {
            let message = `${command}\n`;
            if (log) {
                console.log(`prodigy-promise: sending ${JSON.stringify(message)}`);
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
