"use strict";

const express = require("express");
const router = express.Router();
const cueList = require("@services/cue-list");
const cueRun = require("@services/cue-run");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await cueList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get cue list",
        });
    }
});

router.get("/run/:number", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await cueRun(req.params.number),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to run cue",
        });
    }
});

router.get("/run/:number/:playbackId", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await cueRun(parseInt(req.params.number), parseInt(req.params.playbackId)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to run cue",
        });
    }
});

module.exports = router;
