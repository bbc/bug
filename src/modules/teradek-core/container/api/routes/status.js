const express = require("express");
const router = express.Router();
const statusGet = require("../../services/status-get");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await statusGet(),
        });
    })
);

module.exports = router;
