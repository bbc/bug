const express = require("express");
const codecList = require("@services/codec-list");
const codecGet = require("@services/codec-get");
const codecGetOptions = require("@services/codec-getoptions");
const router = express.Router();

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await codecList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get codec list",
        });
    }
});

router.get("/:codecId", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await codecGet(req.params.codecId),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get codec details",
        });
    }
});

router.get("/getoptions/:fieldName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await codecGetOptions(req.params.fieldName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get codec options list",
        });
    }
});

module.exports = router;
