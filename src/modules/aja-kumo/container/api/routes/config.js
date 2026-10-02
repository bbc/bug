"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const configGet = require("@core/config-get");
const configPut = require("@core/config-put");
const logger = require("@core/logger")(module);

const router = express.Router();

router.get(
    "/",
    asyncHandler(async (req, res) => {
        logger.debug("Reading AJA KUMO panel configuration");
        res.json({ status: "success", data: await configGet() });
    })
);

router.put(
    "/",
    asyncHandler(async (req, res) => {
        logger.debug("Updating AJA KUMO panel configuration");
        res.json({ status: "success", data: await configPut(req.workers, req.body) });
    })
);

module.exports = router;
