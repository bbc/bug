"use strict";

const MDU = require("@utils/mdu");

module.exports = async (index, name) => {
    try {
        const mdu = await MDU();
        const response = await mdu.setName(index, name);

        if (response.status !== 200) {
            return {
                error: "Could not set output name",
                status: "error",
                data: response.output,
            };
        }
        return { status: "success", data: response.output };
    } catch (error) {
        return null;
    }
};
