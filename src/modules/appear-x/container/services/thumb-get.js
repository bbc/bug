"use strict";

const configGet = require("@core/config-get");
const axios = require("axios");
const https = require("https");

module.exports = async (board, slot) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    const url = `https://${config.address}/board/${board}/ui/thumbs/sdi_${slot}.png`;
    const response = await axios.get(url, {
        responseType: "arraybuffer",
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
        headers: {
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
        },
    });

    return Buffer.from(response.data, "base64");
};
