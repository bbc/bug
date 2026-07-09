"use strict";
const net = require("net");

module.exports = (address) => {
    if (typeof address !== "string") {
        return false;
    }

    const candidate = address.trim();
    if (!candidate || candidate.includes(" ")) {
        return false;
    }

    if (net.isIP(candidate) !== 0) {
        return true;
    }

    // Reject malformed IPv4-like input such as 172.27.2122.
    if (/^[0-9.]+$/.test(candidate)) {
        return false;
    }

    // Allow hostnames used in local DNS as well as FQDNs.
    return /^(?=.{1,253}$)(?!-)(?:[a-zA-Z0-9-]{1,63}\.)*[a-zA-Z0-9-]{1,63}(?<!-)$/.test(candidate);
};

