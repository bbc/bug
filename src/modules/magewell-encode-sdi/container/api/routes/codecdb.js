const express = require("express");
const router = express.Router();
const codecDbGet = require("@services/codecdb-get");
const asyncHandler = require("express-async-handler");

router.get(
    "/:streamType",
    asyncHandler(async (req, res) => {
        const result = await codecDbGet(req.params.streamType);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
