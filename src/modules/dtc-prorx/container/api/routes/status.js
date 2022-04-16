const express = require("express");
const router = express.Router();
const statusGet = require("../../services/status-get");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await statusGet(),
        });
    })
);

module.exports = router;
