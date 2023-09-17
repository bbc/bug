"use strict";
const axios = require("axios");

const get = async ({ host, apiFunction = "", apiMenu = "" }) => {
    try {
        const response = await axios.get(
            `http://${host}/cgi-bin/mbServerSide.ccgi?func=${encodeURIComponent(
                apiFunction
            )}&menuName=${encodeURIComponent(apiMenu)}`
        );
        if (response && response?.data) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
    return null;
};

const set = async ({ host, category = "", value = "", field = "" }) => {
    try {
        const url = category
            ? `http://${host}/cgi-bin/mbServerSide.ccgi?func=controlChange&name=${encodeURIComponent(
                  category
              )}&value=${encodeURIComponent(value)}&vControl=${encodeURIComponent(field)}`
            : `http://${host}/cgi-bin/mbServerSide.ccgi?func=controlChange&name=${encodeURIComponent(
                  field
              )}&value=${encodeURIComponent(value)}`;

        console.log(`hitomi-api: setting value: ${url}`);
        const response = await axios.get(url);
        if (response && response?.data) {
            console.error(`ERROR: ${response.data}`);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
};

module.exports = {
    get,
    set,
};
