const express = require("express");
const route = express.Router();

const getFeedItems = require("@services/feed-items");

route.all("/items", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getFeedItems(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch RSS Items",
        });
    }
});

module.exports = route;
