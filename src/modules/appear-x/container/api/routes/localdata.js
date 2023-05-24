const express = require("express");
const router = express.Router();
const localdataSet = require("@services/localdata-set");
const localdataRevert = require("@services/localdata-revert");
const localdataPending = require("@services/localdata-pending");
const asyncHandler = require("express-async-handler");

router.post(
    "/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await localdataSet(req.params.serviceId, req.body);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/checkpending/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await localdataPending(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/revert/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await localdataRevert(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
