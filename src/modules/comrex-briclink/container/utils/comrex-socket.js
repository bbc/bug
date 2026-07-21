"use strict";
const net = require("net");
const Char0 = String.fromCharCode(0);
const parseXml = require("@rgrove/parse-xml");
const md5 = require("md5");
const delay = require("delay");
const MessageBuffer = require("@utils/message-buffer");
const EventEmitter = require("events");
const logger = require("@core/logger")(module);

class ComrexSocket extends EventEmitter {
    constructor({
        host = "127.0.0.1",
        port = "80",
        username = "comrex",
        password = "comrex",
        commands = [],
        monitors = {},
        debug = false,
        timeout = 5000,
        idleTimeout = 20000,
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
            idleTimeout,
        };

        this.socket = null;
        this.client = null;
        this.stringBuffer = "";
        this.loggedIn = false;
        this.lastDataAt = null;
        this.idleTimer = null;
        this.waitingForLoginResponse = false;
        this.buffer = new MessageBuffer("\n");
    }

    connect() {
        return new Promise((resolve, reject) => {
            const self = this;
            self.socket = new net.Socket();

            // fail fast if we can't connect and log in within the timeout - otherwise a
            // dead link (for example after a VPN drop) leaves us hanging on a stale TCP
            // connection for a very long time before the worker can retry
            let settled = false;
            const connectTimer = setTimeout(() => {
                if (settled) return;
                logger.error("timed out connecting to device");
                self.socket.destroy();
                finish(new Error("connect timeout"));
            }, self.opts.timeout);

            const finish = (error) => {
                if (settled) return;
                settled = true;
                clearTimeout(connectTimer);
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            };

            self.socket.on("error", (err) => {
                logger.error(err?.message || err);
                logger.error("could not connect to device");
                this.socket.destroy();
                finish(err instanceof Error ? err : new Error("connection error"));
            });

            self.socket.on("close", () => {
                self._stopWatchdog();
                if (self.loggedIn) {
                    self.loggedIn = false;
                    self.emit("disconnect");
                }
            });

            self.socket.on("data", async function (data) {
                const sanitizedData = data.toString().replace("\u0000", "").trim();

                if (self.opts.debug) {
                    logger.debug(sanitizedData);
                }

                if (!self.loggedIn) {
                    const result = parseXml(sanitizedData);
                    if (result.children?.[0]?.attributes?.challenge) {
                        if (result.children?.[0]?.attributes?.["success"] === "false") {
                            // we've tried, and failed to log in
                            logger.error("failed to log in");
                            finish(new Error("login failed"));
                            return;
                        }
                        if (self.waitingForLoginResponse) {
                            // we didn't get a response last time - we'll delay by 10 seconds
                            await delay(10000);
                        }
                        logger.info(`attempting to log in with provided credentials`);

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
                            self.lastDataAt = Date.now();
                            logger.info("logged in OK");

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

                            self._startWatchdog();
                            finish();
                            return;
                        }
                    }
                }

                // we're logged in - push the data into the message buffer
                self.lastDataAt = Date.now();
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
                logger.info(`connected to ${self.opts.host}:${self.opts.port}`);
                self.socket.setKeepAlive(true, 10000);
                self.loggedIn = false;
                self.socket.write(`<login />${Char0}`);
            });
        });
    }

    send(message) {
        this.socket.write(`${message}${Char0}`);
    }

    isConnected() {
        return Boolean(this.loggedIn && this.socket && !this.socket.destroyed);
    }

    msSinceLastData() {
        return this.lastDataAt === null ? Infinity : Date.now() - this.lastDataAt;
    }

    // a half-open TCP connection (for example after a VPN drop) can look alive while no
    // data flows, so we watch for inactivity and tear the socket down when data stops
    _startWatchdog() {
        if (!this.opts.idleTimeout) {
            return;
        }
        this._stopWatchdog();
        this.idleTimer = setInterval(() => {
            if (this.msSinceLastData() > this.opts.idleTimeout) {
                logger.warning("no data received from device - assuming connection lost");
                this.socket.destroy();
            }
        }, Math.max(1000, Math.floor(this.opts.idleTimeout / 4)));
    }

    _stopWatchdog() {
        if (this.idleTimer) {
            clearInterval(this.idleTimer);
            this.idleTimer = null;
        }
    }

    disconnect() {
        this._stopWatchdog();
        this.socket.destroy();
    }
}

module.exports = ComrexSocket;
