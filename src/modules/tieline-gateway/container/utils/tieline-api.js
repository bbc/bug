"use strict";

const convert = require("xml-js");
const DigestFetch = require("./digest-fetch");
const axios = require("axios");

module.exports = class TielineApi {
    constructor({ host = "127.0.0.1", port = 80, username = "admin", password = "password", timeout = 2000 }) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.timeout = timeout;
        this.port = port;
    }

    async getStatic(path) {
        const url = `http://${this.host}${path}`;
        const response = await axios.get(url);
        if (response && response?.data) {
            return convert.xml2js(response?.data, { compact: true });
        }
        return null;
    }

    async get(path) {
        const client = new DigestFetch(this.username, this.password);
        const url = `http://${this.host}${path}`;
        console.log(`tieline-api: requesting from API at ${url}`);
        const result = await client.fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/xml",
                },
            },
            this.timeout
        );
        const resultText = await result.text();
        if (resultText.indexOf("Bad Request") > -1) {
            throw new Error(`tieline-api: bad request`);
        }
        return convert.xml2js(resultText, { compact: true });
    }

    async post(path, data) {
        const client = new DigestFetch(this.username, this.password);
        const url = `http://${this.host}${path}`;
        console.log(`tieline-api: POST request to API at ${url} with data ${JSON.stringify(data)}`);

        // convert body to xml
        let xmlData;
        try {
            xmlData = convert.json2xml(data, { compact: true });
        } catch (error) {
            console.log(data);
            throw new Error(`tieline-api: could not parse JSON`);
        }

        const result = await client.fetch(
            url,
            {
                method: "POST",
                body: xmlData,
                headers: {
                    "Content-Type": "application/xml",
                },
            },
            this.timeout
        );
        const resultText = await result.text();
        try {
            return convert.xml2js(resultText, { compact: true });
        } catch (error) {
            console.log(resultText);
            throw new Error(`tieline-api: could not parse XML`);
        }
    }
};
