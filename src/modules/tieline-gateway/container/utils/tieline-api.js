"use strict";

const convert = require("xml-js");
const DigestFetch = require("./digest-fetch");
const axios = require("axios");
const logger = require("@core/logger")(module);

module.exports = class TielineApi {
    constructor({ host = "127.0.0.1", port = 80, username = "admin", password = "password", timeout = 2000 }) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.timeout = timeout;
        this.client = new DigestFetch(this.username, this.password);
        this.baseUrl = `http://${host}:${port}`;
    }

    async getStatic(path) {
        const url = `${this.baseUrl}${path}`;
        const response = await axios.get(url, { timeout: this.timeout });
        if (response?.data) return convert.xml2js(response.data, { compact: true });
        return null;
    }

    async get(path, debug = false) {
        const url = `${this.baseUrl}${path}`;
        if (debug) logger.debug(`TielineApi GET: ${url}`);

        const result = await this.client.fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/xml" },
        }, this.timeout);

        const resultText = await result.text();
        if (resultText.includes("Bad Request")) {
            throw new Error(`Bad Request from API at ${url}`);
        }

        return convert.xml2js(resultText, { compact: true });
    }

    async post(path, data) {
        const url = `${this.baseUrl}${path}`;
        logger.debug(`TielineApi POST: ${url}`);

        let xmlData;
        try {
            xmlData = convert.json2xml(data, { compact: true });
        } catch (error) {
            logger.debug(data);
            throw new Error(`Could not convert JSON to XML: ${error.message}`);
        }

        const result = await this.client.fetch(url, {
            method: "POST",
            body: xmlData,
            headers: {
                "Content-Type": "application/xml",
                "Content-Length": Buffer.byteLength(xmlData),
                "Connection": "close"
            },
        }, this.timeout);

        const resultText = await result.text();
        try {
            return convert.xml2js(resultText, { compact: true });
        } catch (error) {
            logger.debug(resultText);
            throw new Error(`Could not parse XML: ${error.message}`);
        }
    }
};