const express = require("express");
const router = express.Router();
const interfaceList = require("@services/interface-list");
// const interfaceHistory = require("../../services/interface-history");
const interfaceEnable = require("@services/interface-enable");
const interfaceDisable = require("@services/interface-disable");
// const mikrotikInterfaceProtect = require("../../services/mikrotik-interfaceprotect");
// const mikrotikInterfaceUnprotect = require("../../services/mikrotik-interfaceunprotect");
const interfaceSetVlanTrunk = require("@services/interface-setvlantrunk");
const interfaceSetVlanAccess = require("@services/interface-setvlanaccess");
const interfaceRename = require("@services/interface-rename");
const asyncHandler = require("express-async-handler");

router.all(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceList(req.body.sortField, req.body.sortDirection, req.body.filters),
        });
    })
);

router.all(
    "/stack/:stackId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceList(req.body.sortField, req.body.sortDirection, req.body.filters, req.params.stackId),
        });
    })
);

// router.post(
//     "/",
//     asyncHandler(async (req, res) => {
//         res.json({
//             status: "success",
//             data: await interfaceCombinedList(req.body.sortField, req.body.sortDirection, req.body.filters),
//         });
//     })
// );

// router.get(
//     "/:interfaceName",
//     asyncHandler(async (req, res) => {
//         const result = await interfaceCombined(req.params.interfaceName);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

// router.get(
//     "/history/:interfaceName",
//     asyncHandler(async (req, res) => {
//         const result = await interfaceHistory(req.params.interfaceName);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

router.get(
    "/rename/:interfaceId/:interfaceName",
    asyncHandler(async (req, res) => {
        const result = await interfaceRename(req.params.interfaceId, req.params.interfaceName);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/rename/:interfaceId/",
    asyncHandler(async (req, res) => {
        const result = await interfaceRename(req.params.interfaceId, "");
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/setvlantrunk/:interfaceId/",
    asyncHandler(async (req, res) => {
        const result = await interfaceSetVlanTrunk(req.params.interfaceId, req.body.untaggedVlan, req.body.taggedVlans);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/setvlanaccess/:interfaceId/:untaggedVlan",
    asyncHandler(async (req, res) => {
        const result = await interfaceSetVlanAccess(req.params.interfaceId, req.params.untaggedVlan);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

// router.get(
//     "/history/:interfaceName/:start/:end",
//     asyncHandler(async (req, res) => {
//         const result = await interfaceHistory(
//             req.params.interfaceName,
//             parseInt(req.params.start),
//             parseInt(req.params.end)
//         );
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

router.get(
    "/enable/:interfaceId",
    asyncHandler(async (req, res) => {
        const result = await interfaceEnable(req.params.interfaceId);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

router.get(
    "/disable/:interfaceId",
    asyncHandler(async (req, res) => {
        const result = await interfaceDisable(req.params.interfaceId);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

// router.get(
//     "/protect/:interfaceName",
//     asyncHandler(async (req, res) => {
//         const result = await mikrotikInterfaceProtect(req.params.interfaceName);
//         res.json({
//             status: result ? "success" : "failure",
//             data: null,
//         });
//     })
// );

// router.get(
//     "/unprotect/:interfaceName",
//     asyncHandler(async (req, res) => {
//         const result = await mikrotikInterfaceUnprotect(req.params.interfaceName);
//         res.json({
//             status: result ? "success" : "failure",
//             data: null,
//         });
//     })
// );

module.exports = router;