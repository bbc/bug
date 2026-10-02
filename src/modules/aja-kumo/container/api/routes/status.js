"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const statusGet = require("@services/status-get");
const logger = require("@core/logger")(module);

const router = express.Router();

router.get(
    "/",
    asyncHandler(async (req, res) => {
        logger.debug("Checking AJA KUMO panel status");
        res.json({ status: "success", data: await statusGet() });
    })
);

module.exports = router;
