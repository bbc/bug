const express = require("express");
const sourceList = require("@services/source-list");
const router = express.Router();
const sourceSetSolo = require("@services/source-setsolo");
const sourceClearSolo = require("@services/source-clearsolo");

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get source list",
        });
    }
});

router.get("/setsolo/:sourceIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceSetSolo(req?.params?.sourceIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set source solo",
        });
    }
});

router.get("/clearsolo", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceClearSolo(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to clear source solo",
        });
    }
});

module.exports = router;
