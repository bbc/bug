const express = require("express");
const router = express.Router();
const codecdataGet = require("@services/codecdata-get");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const result = await codecdataGet();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
