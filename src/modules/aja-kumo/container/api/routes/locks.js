"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const routerLockSet = require("@services/router-lock-set");

const router = express.Router();

router.put(
    "/:destination",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await routerLockSet(req.params.destination, req.body?.locked),
        });
    })
);

module.exports = router;
