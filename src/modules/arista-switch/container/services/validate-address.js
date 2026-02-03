"use strict";

const ValidationResult = require("@core/ValidationResult");
const ping = require("ping");

module.exports = async (formData) => {
    try {
        const res = await ping.promise.probe(formData?.address);
        if (res?.alive) {
            console.log(`validate-ping: device ${formData.address} is reachable`);
            return new ValidationResult([
                { state: true, field: "address", message: "Device is reachable" },
            ]);
        }

        console.warn(`validate-ping: device ${formData.address} is not reachable`);
        return new ValidationResult([
            { state: false, field: "address", message: "Device is not reachable" },
        ]);

    } catch (err) {
        console.error(`validate-ping: error checking address ${formData?.address}: ${err.stack || err.message || err}`);
        return new ValidationResult([
            { state: false, field: "address", message: "Address is not valid" },
        ]);
    }
};
