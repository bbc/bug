const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: true,
        });
    })
);

module.exports = router;
