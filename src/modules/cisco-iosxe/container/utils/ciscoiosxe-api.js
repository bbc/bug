"use strict";

const axios = require("axios");
const https = require("https");

exports.get = async function ({ path, host, username, password, data = {}, timeout = 5000, debug = false }) {
    const encodedData = new URLSearchParams(data).toString();
    const url = `https://${host}:443${path}?${encodedData}`;

    if (debug) {
        console.log(url);
    }

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

    if (debug) {
        console.log(response);
    }

    return response?.data;
};

exports.update = async function ({ path, host, username, password, data = {}, timeout = 5000, debug = false }) {
    const url = `https://${host}:443${path}`;

    if (debug) {
        console.log(url);
    }

    const instance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    const response = await instance.patch(url, data, {
        headers: {
            Accept: "application/yang-data+json",
            "Content-Type": "application/yang-data+json",
        },
        timeout: timeout,
        auth: {
            username: username,
            password: password,
        },
    });
    if (debug) {
        console.log(response);
    }
    return response.status === 204;
};

exports.create = async function ({ path, host, username, password, data = {}, timeout = 5000, debug = false }) {
    const url = `https://${host}:443${path}`;

    if (debug) {
        console.log(url);
    }

    const instance = axios.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    const response = await instance.post(url, data, {
        headers: {
            Accept: "application/yang-data+json",
            "Content-Type": "application/yang-data+json",
        },
        timeout: timeout,
        auth: {
            username: username,
            password: password,
        },
    });
    if (debug) {
        console.log(response);
    }
    return response.data;
};
