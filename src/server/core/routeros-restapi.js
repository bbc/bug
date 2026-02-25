"use strict";

const axios = require("axios");
const logger = require("@core/logger")(module);
const obscure = require("@core/obscure-password");

class RouterOSRestApi {
    /**
     * @param {Object} options
     * @param {string} options.host   e.g. http://192.168.88.1
     * @param {string} options.user
     * @param {string} options.password
     * @param {number} [options.timeout] seconds (default 10)
     */
    constructor({
        host,
        user,
        password,
        timeout = 20
    }) {
        if (!host) throw new Error("RouterOSRest requires host");

        // Auto-prepend http:// if missing
        if (!host.startsWith("http://") && !host.startsWith("https://")) {
            host = `http://${host}`;
        }

        // Explicitly block HTTPS (by design choice)
        if (host.startsWith("https://")) {
            throw new Error("HTTPS is disabled for this wrapper. Use HTTP only.");
        }

        // Remove trailing slash
        host = host
        this.client = axios.create({
            baseURL: `${host.replace(/\/$/, "")}/rest`,
            timeout: timeout * 1000,
            auth: {
                username: user,
                password
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    async request(method, path, data = null, params = null) {
        try {
            const req = { method, url: path };

            // Only include non-null
            if (data !== null) req.data = data;
            if (params !== null) req.params = params;

            const response = await this.client.request(req);
            return response.data;
        } catch (err) {
            if (err.response) {
                logger.error(`routeros-restapi error: ${method.toUpperCase()} ${path} failed: ${err?.response?.data?.error || "Unknown error"} / ${err?.response?.data?.message || "No message"} / ${err?.response?.data?.detail || "No detail"}`);
            }
        }
    }

    // GET - print
    get(path, params = null) {
        logger.debug(`routeros-restapi: GET ${path}`);
        return this.request("get", path, null, params);
    }

    // PUT - add
    put(path, data) {
        logger.debug(`routeros-restapi: PUT ${path} with data ${JSON.stringify(data)}`);
        return this.request("put", path, data);
    }

    // PATCH - set
    patch(path, data) {
        logger.debug(`routeros-restapi: PATCH ${path} with data ${JSON.stringify(data)}`);
        return this.request("patch", path, data);
    }

    // DELETE - remove
    delete(path) {
        logger.debug(`routeros-restapi: DELETE ${path}`);
        return this.request("delete", path);
    }

    // POST - execute API command
    post(path, data = {}) {
        logger.debug(`routeros-restapi: POST ${path} with data ${JSON.stringify(data)}`);
        return this.request("post", path, data);
    }
}

module.exports = RouterOSRestApi;