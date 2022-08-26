"use strict";

const axios = require("axios");
const https = require("https");

exports.get = async function ({ path, host, username, password, data = {}, timeout = 5000 }) {
    const encodedData = new URLSearchParams(data).toString();
    const url = `https://${host}:443${path}?${encodedData}`;

    console.log(url);

    const instance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });
    const response = await instance.get(url, {
        headers: {
            Accept: "application/yang-data+json",
        },
        timeout: timeout,
        auth: {
            username: username,
            password: password,
        },
    });

    return response?.data;
};
