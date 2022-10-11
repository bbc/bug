const express = require("express");
const router = express.Router();
const validateAddress = require("@services/validate-address");
const validateAuth = require("@services/validate-auth");
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

router.post(
    "/username",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await validateAuth(req.body),
        });
    })
);

router.post(
    "/password",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await validateAuth(req.body),
        });
    })
);

module.exports = router;
