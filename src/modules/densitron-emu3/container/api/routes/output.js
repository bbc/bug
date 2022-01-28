const express = require("express");
const router = express.Router();

const outputSetName = require("@services/output-setname");
const outputSetState = require("@services/output-setstate");
const outputList = require("@services/output-list");
const outputProtect = require("@services/output-protect");
const outputUnprotect = require("@services/output-unprotect");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

router.all(
    "/:deviceIndex",
    asyncHandler(async (req, res) => {
        const result = await outputList(req?.params?.deviceIndex);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/:deviceIndex/:outputIndex/name",
    asyncHandler(async (req, res) => {
        const result = await outputSetName(req?.params?.deviceIndex, req?.params?.outputIndex, req?.body?.name);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/:deviceIndex/:outputIndex/state",
    asyncHandler(async (req, res) => {
        const result = await outputSetState(req?.params?.deviceIndex, req?.params?.outputIndex, req?.body?.state);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/:deviceIndex/:outputIndex/protect/",
    asyncHandler(async (req, res) => {
        const result = await outputProtect(req?.params?.deviceIndex, req?.params?.outputIndex);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

router.get(
    "/:deviceIndex/:outputIndex/unprotect/",
    asyncHandler(async (req, res) => {
        const result = await outputUnprotect(req?.params?.deviceIndex, req?.params?.outputIndex);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

module.exports = router;
