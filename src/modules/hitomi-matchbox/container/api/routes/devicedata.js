const express = require("express");
const router = express.Router();
const devicedataGet = require("@services/devicedata-get");
const devicedataSet = require("@services/devicedata-set");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const result = await devicedataGet();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await devicedataSet(req.body);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
