const express = require("express");
const route = express.Router();

const getCoreToken = require("@services/core-token");

route.get("/token", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getCoreToken()
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch core token",
        });
    }
});

module.exports = route;
