"use strict";
const validationResult = require("@core/ValidationResult");
const net = require("net");
const ping = require("ping");

function isValidAddress(address) {
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
}

module.exports = async (formData) => {
    try {
        if (!isValidAddress(formData["address"])) {
            return new validationResult([
                {
                    state: false,
                    field: "address",
                    message: "Address is not valid",
                },
            ]);
        }

        let res = await ping.promise.probe(formData["address"]);
        if (res.alive) {
            return new validationResult([
                {
                    state: true,
                    field: "address",
                    message: "Device is reachable",
                },
            ]);
        }
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Device is not reachable",
            },
        ]);
    } catch (error) {
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Address is not valid",
            },
        ]);
    }
};
