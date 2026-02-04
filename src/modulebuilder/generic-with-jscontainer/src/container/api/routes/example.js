const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

// router.all("/", asyncHandler(async (req, res) => {
//     res.json({
//         status: "success",
//         data: await exampleList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
//     });
// }));

// router.get("/:exampleId", asyncHandler(async (req, res) => {
//     res.json({
//         status: "success",
//         data: await exampleGet(req.params.exampleId),
//     });
// }));

module.exports = router;
