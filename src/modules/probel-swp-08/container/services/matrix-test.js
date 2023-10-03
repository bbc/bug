"use strict";

const ping = require("ping");

module.exports = async (address, port) => {
    try {
        let res = await ping.promise.probe(address);
        if (res.alive) {
            return new validationResult([
                {
                    state: true,
                    field: "address",
                    message: "Matrix is reachable",
                },
            ]);
        }
        return new validationResult([
            {
                state: false,
                field: "address",
                message: "Matrix is not reachable",
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
