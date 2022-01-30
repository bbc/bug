const express = require("express");
const router = express.Router();

const outputList = require("@services/output-list");
const outputGet = require("@services/output-get");
const outputSetState = require("@services/output-setstate");
const outputSetName = require("@services/output-setname");
const outputSetDelay = require("@services/output-setdelay");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

router.all(
    "/",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await outputList(),
        });
    })
);

router.get(
    "/:outputNumber",
    asyncHandler(async (req, res) => {
        const result = await outputGet(req?.params?.outputNumber);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/:outputNumber/state",
    asyncHandler(async (req, res) => {
        const result = await outputSetState(req?.params?.outputNumber, req.body.state);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/:outputNumber/name",
    asyncHandler(async (req, res) => {
        const result = await outputSetName(req?.params?.outputNumber, req.body.name);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/:outputNumber/delay",
    asyncHandler(async (req, res) => {
        const result = await outputSetDelay(req?.params?.outputNumber, req.body.delay);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
