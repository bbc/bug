"use strict";

var net = require("net");
var util = require("util");

var _ = require("underscore");
var events = require("events");
var router = require("./router");
var parser = require("./parser");
var lexer = require("./lexer");

/**
 *  Expose `Router`
 */

module.exports = Router;

/**
 *  Router class
 */

function Router(opts) {
    this.opts = opts || {};

    this.connection = null;

    this.connecting = false;
    this.connected = false;

    this.statusObj = {};

    // if we were given the host and port connect right away
    if (this.opts.host && this.opts.port) {
        this.connect(this.opts.host, this.opts.port);
    }
}

/**
 *  Inherit the event emitter
 */

util.inherits(Router, events.EventEmitter);

/**
 *  Connect to the router
 *
 *  @param {String} host
 *  @param {String} port
 *  @returns {Object}
 */

Router.prototype.connect = function (host, port) {
    console.log("1");
    if (this.connecting) return this.connection;
    console.log("2");

    if (host) this.opts.host = host;
    if (port) this.opts.host = host;
    console.log("3");

    if (!this.opts.host) throw new Error("Must supply host name in constructor or this method");
    if (!this.opts.port) throw new Error("Must supply port in constructor or this method");

    console.log("4");

    this.connection = net.createConnection(this.opts.port, this.opts.host);

    this._bindConnection();
    console.log("5");

    return this.connection;
};

/**
 *  Manage the underlying connection
 */

Router.prototype._bindConnection = function () {
    if (this.connecting) return;

    this.connecting = true;

    var self = this;

    this.connection.on("data", function (data) {
        self.updateStatus(parser(data.toString()));
    });

    this.connection.on("connect", function () {
        console.log("connected");
        self.connected = true;
    });

    this.connection.on("timeout", function (e) {
        self.emit("timeout", e);
    });

    this.connection.on("error", function (e) {
        self.emit("error", e);
    });
};

/**
 *  Update the status of the router
 *
 *  @param {Object} obj
 */

Router.prototype.updateStatus = function (obj) {
    if (!obj) return;

    if (!this.statusObj[obj.title]) {
        if (obj.array) {
            this.statusObj[obj.title] = [];
        } else {
            this.statusObj[obj.title] = {};
        }
    }

    for (var key in obj.data) {
        if (obj.array) {
            this.statusObj[obj.title][parseInt(key, 10)] = obj.data[key];
        } else {
            this.statusObj[obj.title][key] = obj.data[key];
        }
    }

    this.emit("update", _.clone(this.statusObj));
};

/**
 *  Route an output
 *
 *  @param {Number} output
 *  @param {Number} input
 */

Router.prototype.route = function (output, input) {
    var str = ["VIDEO OUTPUT ROUTING:", output + " " + input].join("\n");
    str += "\n\n";

    if (!this.connected) return false;

    this.connection.write(str);

    return true;
};

/**
 *  Set an output label
 *
 *  @param {Number} output
 *  @param {String} label
 */

Router.prototype.setOutputLabel = function (output, label) {
    var str = ["OUTPUT LABELS:", output + " " + label].join("\n");
    str += "\n\n";

    if (!this.connected) return false;

    this.connection.write(str);

    return true;
};

/**
 *  Set an input label
 *
 *  @param {Number} input
 *  @param {String} label
 */

Router.prototype.setInputLabel = function (input, label) {
    var str = ["INPUT LABELS:", input + " " + label].join("\n");
    str += "\n\n";

    if (!this.connected) return false;

    this.connection.write(str);

    return true;
};
