const express = require("express");
const route = express.Router();

const getLink = require("@services/link-get");
const getLinkList = require("@services/link-list");

route.get("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getLinkList()
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch link list",
        });
    }
});

route.get("/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getLink(req?.params?.sid)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch link",
        });
    }
});

module.exports = route;
