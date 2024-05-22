"use strict";
const net = require("net");
const util = require("util");
const events = require("events");

module.exports = Router;

function Router(opts) {
    this.opts = opts || {};

    this.socket = null;
}

let connectionTimer;

util.inherits(Router, events.EventEmitter);

Router.prototype.connect = function () {
    const instance = this;
    return new Promise((resolve, reject) => {
        if (!instance.opts.host) throw new Error("prodigy-promise: please supply host parameter");
        if (!instance.opts.port) throw new Error("prodigy-promise: please supply port parameter");

        connectionTimer = setTimeout(() => {
            console.log("prodigy-promise: timed out after 10 seconds");
            reject();
        }, 10000);

        let dataString = "";

        instance.socket = net.createConnection(instance.opts.port, instance.opts.host);

        instance.socket.on("data", function (rawData) {
            const responseLines = rawData.toString().trim().split("\n");
            for (let eachLine of responseLines) {
                if (dataString) {
                    // we're already collecting something
                    if (eachLine.indexOf(`{"type"`) !== 0 && eachLine.indexOf(`{"payload"`) !== 0) {
                        // add it to the growing string
                        dataString += eachLine;
                    } else {
                        console.log(`prodigy-promise: ignoring data ${eachLine}`);
                    }
                } else {
                    // we're starting a new one. Yay!
                    dataString = eachLine;
                }
            }

            if (rawData.indexOf("\n") > -1) {
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
                        console.log(`prodigy-promise: unknown response`, parsedData);
                    }
                    dataString = "";
                } catch (error) {
                    console.error(`prodigy-promise: could not decode JSON response`);
                    // console.log(dataString);
                }
            }
        });

        instance.socket.on("connect", function () {
            clearTimeout(connectionTimer);
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

Router.prototype.disconnect = function (log = false) {
    this.socket.end();
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
