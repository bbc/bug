const express = require("express");
const router = express.Router();
const codecDbGet = require("@services/codecdb-get");
const asyncHandler = require("express-async-handler");

router.get(
    "/:streamType",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await codecDbGet(req.params.streamType),
        });
    })
);

module.exports = router;
