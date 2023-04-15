const express = require("express");
const ddmDomains = require("@services/ddm-getdomains");
const route = express.Router();

route.get("/list", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmDomains(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get domains list",
        });
    }
});

module.exports = route;
