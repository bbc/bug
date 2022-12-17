"use strict";
const net = require("net");
const Char0 = String.fromCharCode(0);
const parseXml = require("@rgrove/parse-xml");
const md5 = require("md5");
const delay = require("delay");
const MessageBuffer = require("@utils/message-buffer");
const EventEmitter = require("events");

class ComrexSocket extends EventEmitter {
    constructor({
        host = "127.0.0.1",
        port = "80",
        username = "comrex",
        password = "comrex",
        commands = [],
        monitors = {},
        debug = false,
        timeout = 2000,
    }) {
        super();

        this.opts = {
            host,
            port,
            username,
            password,
            commands,
            monitors,
            debug,
            timeout,
        };

        this.socket = null;
        this.client = null;
        this.stringBuffer = "";
        this.loggedIn = false;
        this.waitingForLoginResponse = false;
        this.buffer = new MessageBuffer("\n");
    }

    connect() {
        return new Promise((resolve, reject) => {
            const self = this;
            self.socket = new net.Socket();

            self.socket.on("error", (err) => {
                console.log(err);
                console.log("comrex-socket: could not connect to device");
                this.socket.destroy();
                reject();
            });

            self.socket.on("data", async function (data) {
                const sanitizedData = data.toString().replace("\u0000", "").trim();

                if (self.opts.debug) {
                    console.log(sanitizedData);
                }

                if (!self.loggedIn) {
                    const result = parseXml(sanitizedData);
                    if (result.children?.[0]?.attributes?.challenge) {
                        if (result.children?.[0]?.attributes?.["success"] === "false") {
                            // we've tried, and failed to log in
                            console.log("comrex-socket: failed to log in");
                            reject();
                            return;
                        }
                        if (self.waitingForLoginResponse) {
                            // we didn't get a response last time - we'll delay by 10 seconds
                            await delay(10000);
                        }
                        console.log(
                            `comrex-socket: logging in with credentials: ${self.opts.username} / ${self.opts.password}`
                        );

                        // this is what comrex require to log into the device
                        const hashedChallenge = md5(result.children?.[0]?.attributes?.challenge + self.opts.password);

                        self.waitingForLoginResponse = true;
                        self.socket.write(
                            `<login username="${self.opts.username}" response="${hashedChallenge}"/>${Char0}`
                        );
                        return;
                    } else if (result.children?.[0]?.name === "login") {
                        self.waitingForLoginResponse = false;
                        if (result.children?.[0]?.attributes?.["success"] === "true") {
                            self.loggedIn = true;
                            console.log("comrex-socket: logged in OK");

                            // any one-off commands
                            for (const command of self.opts.commands) {
                                self.socket.write(`<${command}/>${Char0}`);
                            }

                            // now request any monitors
                            let monitorArray = [];
                            for (const [name, value] of Object.entries(self.opts.monitors)) {
                                monitorArray.push(`${name}='${value}'`);
                            }
                            if (monitorArray.length > 0) {
                                self.socket.write(`<monitor ${monitorArray.join(" ")}/>${Char0}`);
                            }

                            resolve();
                            return;
                        }
                    }
                }

                // we're logged in - push the data into the message buffer
                self.buffer.push(data.toString().replace("\u0000", "").replace("\u0000", ""));

                // and when we're done, emit the update event
                while (!self.buffer.isFinished()) {
                    const bufferedData = self.buffer.handleData().trim();
                    try {
                        self.emit("update", parseXml(bufferedData));
                    } catch (error) {
                        // do nothing
                    }
                }
            });

            self.socket.connect(self.opts.port, self.opts.host, function () {
                console.log(`comrex-socket: connected to ${self.opts.host}:${self.opts.port}`);
                self.loggedIn = false;
                self.socket.write(`<login />${Char0}`);
            });
        });
    }

    send(message) {
        this.socket.write(`${message}${Char0}`);
    }

    disconnect() {
        this.socket.destroy();
    }
}

module.exports = ComrexSocket;
