"use strict";
const axios = require("axios");
const https = require("https");
const mongoSingle = require("@core/mongo-single");

module.exports = class NetgearAPI {
    constructor({ protocol = "https", host, port = 8443, username, password, debug = false }) {
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

        this.dbName = `token_${this.opts.host}:${this.opts.username}`;

    }

    getToken = async () => {
        const connectionHash = `${this.opts.host}:${this.opts.username}`;
        let token = await mongoSingle.get(this.dbName);
        if (!token) {
            // we need to log in
            token = await this.login();
            if (token) {
                console.log(`netgear-api: got new token for connection ${this.dbName}: ${token}`);
                await mongoSingle.set(this.dbName, token, 82800);
            }
        }
        return token;
    }

    login = async () => {
        const url = `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/api/v1/login`;
        const jsonBody = {
            login: {
                username: this.opts.username,
                password: this.opts.password,
            }
        };
        try {
            const response = await axios.post(url, jsonBody, {
                httpsAgent: this.agent,
                timeout: 5000,
            });
            console.log(`netgear-api: connected OK to Netgear API at ${url}`);
            return response?.data?.login?.token;
        } catch (error) {
            console.log(`netgear-api: ${error?.response.status} ${error?.response.statusText} for ${url}`);
            return false;
        }
    };

    post = async ({ params = {}, path, id = 1 }) => {
        const url = `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/api/v1/${path}`;

        const token = await this.getToken();

        try {
            const response = await axios.post(url, params, {
                httpsAgent: this.agent,
                timeout: 5000,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response?.data?.resp.status === "failure") {
                console.log(response?.data?.resp);
                console.log(params);
                console.log(`netgear-api: failed to POST - ${response?.data?.resp?.respMsg}`);
                return false;
            }

            return response?.data;
        } catch (error) {
            console.log(`netgear-api: ${error?.response?.status} ${error?.response?.statusText} for ${url}`);
            if (error.response.status === 403) {
                await mongoSingle.clear(this.dbName);
                throw new Error("Login token expired");
            }
            return false;
        }
    };

    get = async ({ path, id = 1 }) => {
        const url = `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/api/v1/${path}`;

        const token = await this.getToken();

        try {
            const response = await axios.get(url, {
                httpsAgent: this.agent,
                timeout: 6000,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response?.data?.resp?.status === "failure") {
                console.log(`netgear-api: failed to GET - ${response?.data?.resp?.respMsg}`);
                return false;
            }

            return response?.data;
        } catch (error) {
            if (error?.response) {
                console.log(`netgear-api: ${error?.response?.status} ${error?.response?.statusText} for ${url}`);
                if (error?.response?.status === 403) {
                    await mongoSingle.clear(this.dbName);
                    throw new Error("Login token expired");
                }
            }
            else {
                console.log(error);
            }
            return false;
        }
    };
};
