"use strict";

const axios = require("axios");

module.exports = async ({ host, username, password, timeout = 5000 }) => {
    let response = {};
    try {
        response = await axios.get(host, {
            timeout: timeout,
            auth: {
                username: username,
                password: password,
            },
        });
    } catch (error) {
        response.error = error;
    }
    return response;
};
