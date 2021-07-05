"use strict";

const MDU = require("@utils/mdu");

module.exports = async (index, name) => {
    try {
        const mdu = await MDU();
        const response = await mdu.setName(index, name);

        if (response.status !== 200) {
            return {
                error: "Could not set output name",
                status: "failure",
                data: response.output,
            };
        }
        return { status: "success", data: response.output };
    } catch (error) {
        return { status: "failure", error: error };
    }
};
