const express = require("express");
const codecList = require("@services/codec-list");
const codecGet = require("@services/codec-get");
const codecGetOptions = require("@services/codec-getoptions");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.all(
    "/",
    asyncHandler(async function (req, res) {
        res.json({
            status: "success",
            data: await codecList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    })
);

router.get(
    "/:codecId",
    asyncHandler(async function (req, res) {
        res.json({
            status: "success",
            data: await codecGet(req.params.codecId),
        });
    })
);

router.get(
    "/getoptions/:fieldName",
    asyncHandler(async function (req, res) {
        res.json({
            status: "success",
            data: await codecGetOptions(req.params.fieldName),
        });
    })
);

module.exports = router;
