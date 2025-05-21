"use strict";
const net = require("net");
const util = require("util");
const events = require("events");
const netstringParser = require("./netstring-parser");

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
        if (!instance.opts.host) throw new Error("ultrix-promise: please supply host parameter");
        if (!instance.opts.port) throw new Error("ultrix-promise: please supply port parameter");

        connectionTimer = setTimeout(() => {
            console.log("ultrix-promise: timed out after 10 seconds");
            reject();
        }, 10000);

        let buffer = Buffer.alloc(0);

        instance.socket = net.createConnection(instance.opts.port, instance.opts.host);

        instance.socket.on("data", function (rawData) {

            // buffer = Buffer.concat([buffer, chunk]);

            // console.log(buffer.length);

            // while (true) {
            //     const colonIndex = buffer.indexOf(':');
            //     console.log("colonIndex", colonIndex);
            //     if (colonIndex === -1) break;

            //     const lengthStr = buffer.subarray(0, colonIndex).toString();
            //     const length = parseInt(lengthStr, 10);
            //     console.log("length", length);
            //     if (isNaN(length)) throw new Error('Invalid netstring length');

            //     const totalLength = colonIndex + 1 + length + 1; // +1 for colon, +1 for comma
            //     if (buffer.length < totalLength) break; // Wait for more data

            //     const data = buffer.subarray(colonIndex + 1, colonIndex + 1 + length);
            //     const comma = buffer[colonIndex + 1 + length];
            //     if (comma !== 44) throw new Error('Netstring must end with a comma');

            //     // Process the netstring
            //     try {
            //         const text = data.toString();
            //         const json = JSON.parse(text);
            //         console.log('Parsed JSON:', json);
            //     } catch {
            //         console.log('Binary data:', data);
            //     }

            //     // Remove the parsed netstring from the buffer
            //     buffer = buffer.subarray(totalLength);
            // }


            if (rawData.toString().includes(`"zip":"gzip"`)) {
                console.log("BINARY!!!!!!!!!!!!!!!!!!!!!");
            }
            else {
                // if(rawData.endsWith()
                // Regular expression to match netstrings
                const netstringRegex = /(\d+:\{.*?\})(?=,\d+:|$)/g;

                // Extract and format netstrings
                const netstrings = rawData.toString().replace(/,$/, '').match(netstringRegex)?.map(ns => ns + ',');

                if (netstrings) {
                    // Output each netstring
                    netstrings.forEach((ns, i) => {
                        let parsedNs = netstringParser(ns);
                        if (!Array.isArray(parsedNs)) {
                            parsedNs = [parsedNs];
                        }
                        for (let eachNs of parsedNs) {
                            if (eachNs?.type === "keepalive") {
                                instance.emit("keepalive");
                            }
                            else if (eachNs?.payload?.oid) {
                                instance.emit("update", eachNs);
                            }
                            else {
                                console.log(`ultrix-promise: received non oid-based data: ${JSON.stringify(eachNs)}`);
                            }
                        }
                    });
                }
                else {

                    console.log(`ultrix-promise: received non-netstring data, length: ${rawData.length} byte(s)`);
                    // console.log(`ultrix-promise: received non-netstring data, length: ${rawData.length} byte(s)`, rawData.toString());
                }
            }
        });

        instance.socket.on("connect", function () {
            clearTimeout(connectionTimer);
            console.log(`ultrix-promise: connected to ${instance.opts.host}:${instance.opts.port}`);
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
            const jsonCommand = JSON.stringify(command);
            const message = `${jsonCommand.length}:${jsonCommand},`
            if (log) {
                console.log(`ultrix-promise: sending ${JSON.stringify(message)}`);
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
