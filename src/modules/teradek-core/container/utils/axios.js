const axios = require("axios");

const instance = axios.create({
    baseURL: "https://api-core.teradek.com/api/",
    timeout: 2000,
});

module.exports = instance;
