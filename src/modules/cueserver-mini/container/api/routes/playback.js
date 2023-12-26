"use strict";

const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const playbackList = require("@services/playback-list");
const playbackSelect = require("@services/playback-select");
const playbackClear = require("@services/playback-clear");
const playbackClearAll = require("@services/playback-clearall");
const playbackRename = require("@services/playback-rename");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await playbackList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get playback list",
        });
    }
});

router.get("/select/:playbackId", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await playbackSelect(parseInt(req.params.playbackId)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to select playback",
        });
    }
});

router.get("/clear/:playbackId", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await playbackClear(parseInt(req.params.playbackId)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to clear playback",
        });
    }
});

router.get("/clear", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await playbackClearAll(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to clear playback",
        });
    }
});

router.post(
    "/:playbackId/rename",
    asyncHandler(async (req, res) => {
        const result = await playbackRename(req?.params?.playbackId, req.body.name);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
