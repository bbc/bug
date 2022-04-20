const express = require("express");
const route = express.Router();

const getDownloadStats = require("@services/download-stats");

route.all("/stats", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getDownloadStats(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch download stats",
        });
    }
});

module.exports = route;
