"use strict";
const axios = require("axios");
const https = require("https");

module.exports = async ({
    protocol = "https",
    host,
    port = 443,
    username,
    password,
    commands = [],
    format = "json",
    debug = false,
    timeout = 5000,
}) => {
    const url = `${protocol}://${host}:${port}/command-api`;

    // ignore self-signed certs
    const agent = new https.Agent({ rejectUnauthorized: false });

    const jsonBody = {
        jsonrpc: "2.0",
        method: "runCmds",
        params: { version: 1, cmds: commands, format },
        id: 1,
    };

    if (debug) {
        console.log("arista-api request body:", jsonBody);
        console.log("arista-api url:", url);
    }

    try {
        const response = await axios.post(url, jsonBody, {
            httpsAgent: agent,
            auth: { username, password },
            timeout,
        });

        const results = response.data?.result;
        if (!results) {
            throw new Error("no result returned from device");
        }

        // check for errors in any command result
        for (const eachResult of results) {
            if (eachResult.errors?.length) {
                throw new Error(eachResult.errors.join("\n"));
            }
        }

        if (response?.data?.result?.length > 1) {
            return response?.data.result;
        }
        if (response?.data?.result?.length === 1) {
            return response?.data.result[0];
        }

    } catch (err) {
        const msg = getAxiosErrorMessage(err);
        console.error(`arista-api: ERROR: ${msg}`);
        console.log("arista-api url:", url);
        console.log("arista-api request body:", jsonBody);
        throw new Error("arista-api request failed", { cause: err });
    }
};

// extract meaningful message from axios error
const getAxiosErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
    }
    return String(error);
};
