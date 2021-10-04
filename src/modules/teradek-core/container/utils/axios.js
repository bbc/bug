const axios = require("axios");

const instance = axios.create({
    baseURL: "https://api-core.teradek.com/api/",
    timeout: 5000,
});

module.exports = instance;
