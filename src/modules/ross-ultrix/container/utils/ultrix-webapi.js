"use strict";
const axios = require("axios");

const get = async (path, { address, uiPort }) => {

    const url = `http://${address}:${uiPort}/${path}`;
    const response = await axios.get(url);
    return response.data;
};

const post = async (path, { address, uiPort }, jsonBody) => {
    const url = `http://${address}:${uiPort}/${path}`;
    const response = await axios.post(url, jsonBody);
    return response.status === 200;
};

module.exports = {
    get: get,
    post: post
}