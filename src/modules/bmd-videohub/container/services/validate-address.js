"use strict";
const validationResult = require("@core/validationResult");
const ping = require("ping");
const videohubTest = require("@services/videohub-test");

module.exports = async (formData) => {
    try {
        let res = await ping.promise.probe(formData["address"]);
        if (res.alive) {
            if (await videohubTest(formData.address, formData.port)) {
                return new validationResult([
                    {
                        state: true,
                        field: "address",
                        message: "Device is reachable and connecting OK",
                    },
                ]);
            }
            return new validationResult([
                {
                    state: false,
                    field: "address",
                    message: "Device reachable, but cannot connect to BMD API",
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
