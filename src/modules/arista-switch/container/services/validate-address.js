"use strict";

const ValidationResult = require("@core/ValidationResult");
const ping = require("ping");
const logger = require("@core/logger")(module);

module.exports = async (formData) => {
    try {
        const res = await ping.promise.probe(formData?.address);
        if (res?.alive) {
            logger.info(`validate-ping: device ${formData.address} is reachable`);
            return new ValidationResult([
                { state: true, field: "address", message: "Device is reachable" },
            ]);
        }

        logger.warn(`validate-ping: device ${formData.address} is not reachable`);
        return new ValidationResult([
            { state: false, field: "address", message: "Device is not reachable" },
        ]);

    } catch (err) {
        logger.error(`validate-ping: error checking address ${formData?.address}: ${err.stack || err.message || err}`);
        return new ValidationResult([
            { state: false, field: "address", message: "Address is not valid" },
        ]);
    }
};
