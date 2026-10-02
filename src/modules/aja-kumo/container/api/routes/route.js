"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const routerRoute = require("@services/router-route");
const logger = require("@core/logger")(module);

const router = express.Router();

router.get(
    "/:destination/:source",
    asyncHandler(async (req, res) => {
        logger.debug("Routing an AJA KUMO destination");
        res.json({
            status: "success",
            data: await routerRoute(req.params.destination, req.params.source),
        });
    })
);

module.exports = router;
