const express = require("express");
const router = express.Router();
const addressListsList = require("../../services/addresslists-list");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await addressListsList(),
        });
    })
);

module.exports = router;
