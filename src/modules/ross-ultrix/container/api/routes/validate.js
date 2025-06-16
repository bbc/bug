const express = require("express");
const router = express.Router();
const validateAddress = require("../../services/validate-address");
const validatePort = require("../../services/validate-port");
const validateUiPort = require("../../services/validate-uiport");
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
    "/port",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await validatePort(req.body),
        });
    })
);

router.post(
    "/uiPort",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await validateUiPort(req.body),
        });
    })
);

module.exports = router;
