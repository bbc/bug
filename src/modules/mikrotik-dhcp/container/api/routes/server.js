const express = require("express");
const router = express.Router();
const serverList = require("../../services/server-list");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await serverList(),
        });
    })
);

module.exports = router;
