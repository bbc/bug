const express = require("express");
const router = express.Router();
const validateAddress = require("../../services/validate-address");
const asyncHandler = require("express-async-handler");

router.post(
    "/address",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await validateAddress(req.body),
        });
    })
);

module.exports = router;
