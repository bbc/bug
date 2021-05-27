const express = require("express");
const groupAdd = require("@services/group-add");
const route = express.Router();

route.post("/:type/:groupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupAdd(req.params?.type, req.params?.groupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get add group",
        });
    }
});

module.exports = route;
