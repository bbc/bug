"use strict";
const axios = require("axios");
const https = require("https");

module.exports = class AppearXAPI {
    constructor({ protocol = "https", host, port = 443, username, password, debug = false }) {
        this.opts = {
            protocol,
            host,
            port,
            username,
            password,
            debug,
        };

        this.token = "";
        this.agent = new https.Agent({
            rejectUnauthorized: false,
        });
    }

    refreshSession = async () => {
        const url = `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/api/jsonrpc`;
        const jsonBody = {
            jsonrpc: "2.0",
            method: "mmi:1.0/authentication/RefreshSession",
            params: {},
            id: "login",
        };
        try {
            const response = await axios.post(url, jsonBody, {
                httpsAgent: this.agent,
                timeout: 5000,
                headers: { Authorization: `Bearer ${this.token}` },
            });
            this.token = response?.data?.result?.accessToken;
            return true;
        } catch (error) {
            // console.log("-------------------------HEY");
            console.log(error.response);
            // console.log("-------------------------HEY");
            return false;
        }
    };

    connect = async () => {
        const url = `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/api/jsonrpc`;
        const jsonBody = {
            jsonrpc: "2.0",
            method: "authentication:1.0/BeginSession",
            params: {
                local: {
                    username: this.opts.username,
                    password: this.opts.password,
                },
            },
            id: "login",
        };
        try {
            const response = await axios.post(url, jsonBody, {
                httpsAgent: this.agent,
                timeout: 5000,
            });
            console.log(`appearx-api: connected OK to AppearX API at ${url}`);
            this.token = response?.data?.result?.accessToken;
        } catch (error) {
            console.log(`appearx-api: failed to connect to AppearX API at ${url}: ${error.message}`);
            return false;
        }
        if (!this.token) {
            throw new Error("Failed to connect to AppearX API - no valid toket returned");
        }
        return true;
    };

    post = async ({ method, params = {}, path, id = 1 }) => {
        const url = `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/${path}`;
        const jsonBody = {
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: id,
        };

        try {
            const response = await axios.post(url, jsonBody, {
                httpsAgent: this.agent,
                timeout: 5000,
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return response?.data?.result;
        } catch (error) {
            if (error?.response?.data?.error?.message) {
                console.log(`appearx-api: failed to POST - ${error.response.data.error.message}`);
            } else {
                console.log(error?.response?.data);
            }
            console.log(JSON.stringify(jsonBody));
            return false;
        }
    };
};
