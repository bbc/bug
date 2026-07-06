const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const codecStatusGet = require("@services/codecstatus-get");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await codecStatusGet(),
    });
}));

module.exports = router;
