const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const codecdataGet = require("@services/codecdata-get");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await codecdataGet(),
    });
}));

module.exports = router;
