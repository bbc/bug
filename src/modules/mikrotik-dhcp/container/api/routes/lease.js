const express = require("express");
const router = express.Router();
const leaseList = require("../../services/lease-list");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseList(),
        });
    })
);

router.post(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseList(req.body.sortField, req.body.sortDirection, req.body.filters),
        });
    })
);

// router.get(
//     "/:leaseId",
//     asyncHandler(async (req, res) => {
//         const result = await leaseGet(req.params.leaseId);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

// router.post(
//     "/comment/:leaseId",
//     asyncHandler(async (req, res) => {
//         const result = await leaseComment(req.params.leaseId, req.body.comment);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

module.exports = router;
