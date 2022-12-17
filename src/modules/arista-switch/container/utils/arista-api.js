"use strict";
const axios = require("axios");
const https = require("https");

module.exports = async ({
    strict = false,
    protocol = "https",
    host,
    port = 443,
    username,
    password,
    commands = [],
    format = "json",
    debug = false,
}) => {
    const url = `${protocol}://${host}:${port}/command-api`;

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const jsonBody = {
        jsonrpc: "2.0",
        method: "runCmds",
        params: {
            version: 1,
            cmds: commands,
            format: format,
        },
        id: 1,
    };

    if (debug) {
        console.log(jsonBody);
    }

    try {
        const response = await axios.post(url, jsonBody, {
            httpsAgent: agent,
            auth: {
                username: username,
                password: password,
            },
            json: jsonBody,
            timeout: 5000,
        });
        if (response?.data?.result) {
            for (let eachResult of response?.data?.result) {
                if (eachResult.errors) {
                    throw new Error(eachResult.errors.join("\n"));
                }
            }
        }
        if (response?.data?.result?.length > 1) {
            return response?.data.result;
        }
        if (response?.data?.result?.length === 1) {
            return response?.data.result[0];
        }
    } catch (error) {
        // console.log(error);
    }
    return null;
};
