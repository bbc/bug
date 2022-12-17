const express = require("express");
const router = express.Router();
// const vlanList = require("@services/vlan-list");
const asyncHandler = require("express-async-handler");

// router.get(
//     "/",
//     asyncHandler(async (req, res) => {
//         res.json({
//             status: "success",
//             data: await vlanList(),
//         });
//     })
// );

module.exports = router;
