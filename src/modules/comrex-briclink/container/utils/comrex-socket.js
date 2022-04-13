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
    }) {
        super();

        this.opts = {
            host,
            port,
            username,
            password,
            commands,
            monitors,
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
            let timeoutTimer = null;

            self.socket.connect(self.opts.port, self.opts.host, function () {
                console.log(`comrex-socket: connected to ${self.opts.host}:${self.opts.port}`);
                clearTimeout(timeoutTimer);
                self.loggedIn = false;
                self.socket.write(`<login />${Char0}`);
            });

            self.socket.on("data", async function (data) {
                clearTimeout(timeoutTimer);
                const sanitizedData = data.toString().replace("\u0000", "").trim();

                if (!self.loggedIn) {
                    const result = parseXml(sanitizedData);
                    if (result.children?.[0]?.attributes?.challenge) {
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
                        // console.log(bufferedData);
                        self.emit("update", parseXml(bufferedData));
                    } catch (error) {
                        // console.log(bufferedData);
                        // console.error(error);
                    }
                }
            });

            self.socket.on("error", async function (err) {
                clearTimeout(timeoutTimer);
                if (err.code == "ENOTFOUND") {
                    console.log("comrex-socket: ERROR no device found at this address");
                    this.socket.destroy();
                    reject();
                }

                if (err.code == "ECONNREFUSED") {
                    console.log("comrex-socket: ERROR connection refused");
                    this.socket.destroy();
                    reject();
                }

                console.error(err);
                reject();
            });

            // Add a 'close' event handler for the socket socket
            self.socket.on("close", function () {
                console.log("comrex-socket: connection closed");
            });

            timeoutTimer = setTimeout(() => {
                console.log("comrex-socket: connection exceeded timeout value");
                this.socket.end();
                reject();
            }, 5000);
        });
    }

    send(message) {
        this.socket.write(`${message}${Char0}`);
    }
}

module.exports = ComrexSocket;
