const express = require("express");
const router = express.Router();
const codecstatusGet = require("@services/codecstatus-get");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const result = await codecstatusGet();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
