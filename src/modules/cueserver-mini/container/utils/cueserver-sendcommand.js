"use strict";

const axios = require("axios");
const getConfig = require("@core/config-get");

module.exports = async (command) => {
    const config = await getConfig();
    const url = `http://${config.address}/exe.cgi?cmd=${command}`;

    console.log(`cueserver-sendcommand: sending command with url ${url}`);

    const response = await axios.get(url);
    const asciiResponse = response?.data.toString("ascii").split("");
    return asciiResponse.length === 2 && asciiResponse[0] === "\x00";
};
