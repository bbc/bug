const express = require("express");
const router = express.Router();
const hashResponse = require("@core/hash-response");
const systemGet = require("@services/system-get");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await systemGet(),
        });
    })
);

module.exports = router;
