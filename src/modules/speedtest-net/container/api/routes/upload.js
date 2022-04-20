const express = require("express");
const route = express.Router();

const getUploadStats = require("@services/upload-stats");

route.all("/stats", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getUploadStats(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch upload stats",
        });
    }
});

module.exports = route;
