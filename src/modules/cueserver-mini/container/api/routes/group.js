"use strict";

const express = require("express");
const router = express.Router();
const groupList = require("@services/group-list");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get group list",
        });
    }
});

// router.get("/:exampleId", async function (req, res, next) {
//     try {
//         res.json({
//             status: "success",
//             data: await exampleGet(req.params.exampleId),
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             status: "error",
//             message: "Failed to get example details",
//         });
//     }
// });

module.exports = router;
