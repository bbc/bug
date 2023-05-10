const express = require("express");
const router = express.Router();
const serviceProtect = require("@services/service-protect");
const serviceUnprotect = require("@services/service-unprotect");
const asyncHandler = require("express-async-handler");

router.get(
    "/protect/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await serviceProtect(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/unprotect/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await serviceUnprotect(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
