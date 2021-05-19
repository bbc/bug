const express = require("express");
const router = express.Router();
const interfaceCombinedList = require("../../services/interface-combinedlist");
const interfaceCombined = require("../../services/interface-combined");
const interfaceHistory = require("../../services/interface-history");
const mikrotikInterfaceEnable = require("../../services/mikrotik-interfaceenable");
const mikrotikInterfaceDisable = require("../../services/mikrotik-interfacedisable");
const mikrotikInterfaceProtect = require("../../services/mikrotik-interfaceprotect");
const mikrotikInterfaceUnprotect = require("../../services/mikrotik-interfaceunprotect");
const mikrotikInterfaceRename = require("../../services/mikrotik-interfacerename");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceCombinedList(),
        });
    })
);

router.get(
    "/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await interfaceCombined(req.params.interfaceName);
        res.json({
            status: result ? "success" : "fail",
            data: result,
        });
    })
);

router.get(
    "/history/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await interfaceHistory(req.params.interfaceName);
        res.json({
            status: result ? "success" : "fail",
            data: result,
        });
    })
);

router.get(
    "/rename/:interfaceId/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceRename(req.params.interfaceId, req.params.interfaceName);
        res.json({
            status: result ? "success" : "fail",
            data: result,
        });
    })
);

router.get(
    "/history/:interfaceName/:start/:end",
    asyncHandler(async (req, res) => {
        const result = await interfaceHistory(
            req.params.interfaceName,
            parseInt(req.params.start),
            parseInt(req.params.end)
        );
        res.json({
            status: result ? "success" : "fail",
            data: result,
        });
    })
);

router.get(
    "/enable/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceEnable(req.params.interfaceName);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

router.get(
    "/disable/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceDisable(req.params.interfaceName);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

router.get(
    "/protect/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceProtect(req.params.interfaceName);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

router.get(
    "/unprotect/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceUnprotect(req.params.interfaceName);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

module.exports = router;
