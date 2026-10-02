"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const capabilityVideoRouter = require("@services/capability-videorouter");
const logger = require("@core/logger")(module);

const router = express.Router();

router.get(
    "/video-router",
    asyncHandler(async (req, res) => {
        logger.debug("Reading AJA KUMO video-router capability");
        res.json({ status: "success", data: await capabilityVideoRouter() });
    })
);

module.exports = router;
