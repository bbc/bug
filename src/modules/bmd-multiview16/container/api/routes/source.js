const express = require("express");
const sourceList = require("@services/source-list");
const router = express.Router();
const sourceSetSolo = require("@services/source-setsolo");
const sourceClearSolo = require("@services/source-clearsolo");
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await sourceList(),
    });
}));

router.get("/setsolo/:sourceIndex", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await sourceSetSolo(req?.params?.sourceIndex),
    });
}));

router.get("/clearsolo", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await sourceClearSolo(),
    });
}));

module.exports = router;
