const express = require("express");
const router = express.Router();
const programList = require("@services/program-list");
const programGetLoaded = require("@services/program-getloaded");
const programLoad = require("@services/program-load");
const asyncHandler = require("express-async-handler");

router.all(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await programList(),
        });
    })
);

router.get(
    "/loaded",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await programGetLoaded(),
        });
    })
);

router.get(
    "/load/:programHandle",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await programLoad(req.params.programHandle),
        });
    })
);

router.get(
    "/unload/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await programLoad("prg-00001"),
        });
    })
);

router.get(
    "/unload/:programHandle",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await programLoad("prg-00001"),
        });
    })
);

module.exports = router;
