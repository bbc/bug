const express = require("express");
const router = express.Router();

const outputList = require("@services/output-list");
const outputGet = require("@services/output-get");
const outputSetState = require("@services/output-setstate");
const outputSetName = require("@services/output-setname");
const outputSetDelay = require("@services/output-setdelay");
const outputProtect = require("@services/output-protect");
const outputUnprotect = require("@services/output-unprotect");
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

router.get(
    "/:outputNumber/protect/",
    asyncHandler(async (req, res) => {
        const result = await outputProtect(req?.params?.outputNumber);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

router.get(
    "/:outputNumber/unprotect/",
    asyncHandler(async (req, res) => {
        const result = await outputUnprotect(req?.params?.outputNumber);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

module.exports = router;
