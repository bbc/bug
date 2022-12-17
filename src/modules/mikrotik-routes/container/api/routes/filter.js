const express = require("express");
const router = express.Router();
const mikrotikFilterUpdate = require("@services/mikrotik-filterupdate");
const mikrotikOspfFilterUpdate = require("@services/mikrotik-ospffilterupdate");
const asyncHandler = require("express-async-handler");

router.get(
    "/update/:distance/:routeComment",
    asyncHandler(async (req, res) => {
        const result = await mikrotikFilterUpdate(req.params.distance, req.params.routeComment);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/update/:distance",
    asyncHandler(async (req, res) => {
        const result = await mikrotikFilterUpdate(req.params.distance, "");
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/ospfupdate/:routeComment",
    asyncHandler(async (req, res) => {
        const result = await mikrotikOspfFilterUpdate(req.params.routeComment);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/ospfupdate",
    asyncHandler(async (req, res) => {
        const result = await mikrotikOspfFilterUpdate("");
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
