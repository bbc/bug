"use strict";

module.exports = (code) => {
    switch (code) {
        case 31:
            return { "type": "warning", "message": "reserved" };
        case 30:
            return { "type": "error", "message": "authentication error" };
        case 29:
            return { "type": "error", "message": "address not set" };
        case 28:
            return { "type": "info", "message": "resolving DNS" };
        case 27:
            return { "type": "info", "message": "initializing" };
        case 25:
            return { "type": "info", "message": "authorizing" };
        case 24:
            return { "type": "warning", "message": "waiting for connection" };
        case 23:
            return { "type": "warning", "message": "connecting" };
        case 22:
            return { "type": "success", "message": "connected" };
        default:
            return { "type": "error", "message": `unknown code ${code}` };
    }
}
