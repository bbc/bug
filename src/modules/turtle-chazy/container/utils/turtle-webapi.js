"use strict";
const axios = require("axios");
const logger = require("@core/logger")(module);

const REQUEST_TIMEOUT_MS = 2500;

const request = async (config) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        return await axios({
            ...config,
            timeout: REQUEST_TIMEOUT_MS,
            signal: controller.signal,
        });
    } catch (error) {
        if (error.code === "ECONNABORTED") {
            logger.warning("Request timed out");
        } else {
            logger.warning(`Request failed: ${error.message}`);
        }
        throw error;
    }
    finally {
        clearTimeout(timeoutId);
    }
};

const get = async (path, { address }) => {

    const url = `http://${address}/${path}`;
    const response = await request({ method: "get", url });
    return response.data;
};

const post = async (path, { address }, jsonBody) => {
    const url = `http://${address}/${path}`;
    const response = await request({ method: "post", url, data: jsonBody });
    return response.status === 200;
};

const command = async (address, commandArray) => {
    const commandString = encodeURIComponent(commandArray.join(" "));
    const url = `http://${address}/cgi-bin/submit?cmd=${commandString}`;
    const response = await request({ method: "get", url });
    return response.data;
};

module.exports = {
    get: get,
    post: post,
    command: command
}