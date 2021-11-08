const express = require("express");
const router = express.Router();
const pendingGet = require("@services/pending-get");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await pendingGet(),
        });
    })
);

module.exports = router;
