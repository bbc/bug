const express = require("express");
const router = express.Router();
const validateAddress = require("@services/validate-address");
const validateSnmp = require("@services/validate-snmp");
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
    "/snmpCommunity",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await validateSnmp(req.body),
        });
    })
);

module.exports = router;
