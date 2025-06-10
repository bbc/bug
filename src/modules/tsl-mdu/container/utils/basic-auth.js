"use strict";

const axios = require("axios");

module.exports = async ({ host, username, password, timeout = 5000 }) => {
    let response = {};
    try {
        if (!host.includes("http://") || !host.includes("https://")) {
            host = "http://" + host;
        }
        console.log(`Attempting authentication for user: ${username}`);
        response = await axios.get(host, {
            timeout: timeout,
            auth: {
                username: username,
                password: password,
            },
        });
        console.log(response);
    } catch (error) {
        console.log(error);
        response.error = error;
    }
    return response;
};
