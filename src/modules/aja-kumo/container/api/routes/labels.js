"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const routerLabelSet = require("@services/router-label-set");
const logger = require("@core/logger")(module);

const router = express.Router();

router.post(
    "/:type/:index",
    asyncHandler(async (req, res) => {
        logger.debug("Updating an AJA KUMO port label");
        res.json({
            status: "success",
            data: await routerLabelSet(req.params.type, req.params.index, req.body?.line1, req.body?.line2),
        });
    })
);

module.exports = router;
