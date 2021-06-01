"use strict";

const MDU = require("@utils/mdu");

module.exports = async (index, delay) => {
    try {
        const mdu = await MDU();
        const response = await mdu.setDelay(index, Math.round(delay));

        if (response.status !== 200) {
            return {
                error: "Could not set delay time",
                status: "error",
                data: response.output,
            };
        }
        return { status: "success", data: response.output };
    } catch (error) {
        return null;
    }
};
