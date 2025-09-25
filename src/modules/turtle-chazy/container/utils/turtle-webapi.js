"use strict";
const axios = require("axios");

const get = async (path, { address }) => {

    const url = `http://${address}/${path}`;
    const response = await axios.get(url);
    return response.data;
};

const post = async (path, { address }, jsonBody) => {
    const url = `http://${address}/${path}`;
    const response = await axios.post(url, jsonBody);
    return response.status === 200;
};

const command = async (address, commandArray) => {
    const commandString = encodeURIComponent(commandArray.join(" "));
    const url = `http://${address}/cgi-bin/submit?cmd=${commandString}`;
    const response = await axios.get(url);
    return response.data;
};

module.exports = {
    get: get,
    post: post,
    command: command
}