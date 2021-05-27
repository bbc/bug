const express = require("express");
const groupAdd = require("@services/group-add");
const groupDelete = require("@services/group-delete");
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

route.delete("/:type/:groupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupDelete(req.params?.type, req.params?.groupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get delete group",
        });
    }
});

module.exports = route;
