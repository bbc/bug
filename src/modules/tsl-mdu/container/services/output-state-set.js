"use strict";

const MDU = require("@utils/mdu");

module.exports = async (index, state) => {
    try {
        const mdu = await MDU();
        const response = await mdu.setOutput(index, state);

        if (response.status !== 200) {
            return {
                error: "Could not set output state",
                data: response.output,
                status: "failure",
            };
        }
        return { status: "success", data: response.output };
    } catch (error) {
        return { status: "failure", error: error };
    }
};
