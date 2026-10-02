"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const routerGet = require("@services/router-get");
const logger = require("@core/logger")(module);

const router = express.Router();

router.get(
    "/",
    asyncHandler(async (req, res) => {
        logger.debug("Reading AJA KUMO router state");
        res.json({ status: "success", data: await routerGet() });
    })
);

module.exports = router;
