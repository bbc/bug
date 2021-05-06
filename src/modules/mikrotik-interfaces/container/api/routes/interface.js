const express = require("express");
const router = express.Router();
const interfaceCombinedList = require("../../services/interface-combinedlist");
const interfaceCombined = require("../../services/interface-combined");
const mikrotikInterfaceEnable = require("../../services/mikrotik-interfaceenable");
const mikrotikInterfaceDisable = require("../../services/mikrotik-interfacedisable");
const mikrotikInterfaceProtect = require("../../services/mikrotik-interfaceprotect");
const mikrotikInterfaceUnprotect = require("../../services/mikrotik-interfaceunprotect");
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
            data: result
        });
    })
);

router.get(
    "/enable/:interfaceId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceEnable(req.params.interfaceId);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

router.get(
    "/disable/:interfaceId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceDisable(req.params.interfaceId);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

router.get(
    "/protect/:interfaceId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceProtect(req.params.interfaceId);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

router.get(
    "/unprotect/:interfaceId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikInterfaceUnprotect(req.params.interfaceId);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

module.exports = router;
