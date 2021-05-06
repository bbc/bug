const express = require("express");
const router = express.Router();
const interfaceCombinedList = require("../../services/interface-combinedlist");
const interfaceCombined = require("../../services/interface-combined");
const mikrotikInterfaceEnable = require("../../services/mikrotik-interfaceenable");
const mikrotikInterfaceDisable = require("../../services/mikrotik-interfacedisable");
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
    "/:interfaceid",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceCombined(req.params.interfaceid),
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

module.exports = router;
