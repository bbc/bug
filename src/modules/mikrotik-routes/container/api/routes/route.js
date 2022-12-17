const express = require("express");
const router = express.Router();
const routeList = require("@services/route-list");
const mikrotikRouteEnable = require("@services/mikrotik-routeenable");
const mikrotikRouteDisable = require("@services/mikrotik-routedisable");
const mikrotikRouteComment = require("@services/mikrotik-routecomment");
const asyncHandler = require("express-async-handler");

router.all(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await routeList(req.body.sortField, req.body.sortDirection, req.body.filters, false),
        });
    })
);

router.all(
    "/all/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await routeList(req.body.sortField, req.body.sortDirection, req.body.filters, true),
        });
    })
);

router.get(
    "/comment/:routeId/:routeComment",
    asyncHandler(async (req, res) => {
        const result = await mikrotikRouteComment(req.params.routeId, req.params.routeComment);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/comment/:routeId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikRouteComment(req.params.routeId, "");
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/enable/:routeId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikRouteEnable(req.params.routeId);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

router.get(
    "/disable/:routeId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikRouteDisable(req.params.routeId);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

module.exports = router;
