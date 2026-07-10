const express = require("express");
const sourcesList = require("@services/sources-list");
const asyncHandler = require("express-async-handler");
// const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();

// route.post("/:sourceDevice/:destinationDevice/:destinationIndex?", asyncHandler(async (req, res) => {
route.post(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await sourcesList(req.body?.sourceDevice, req.body?.destinationDevice, parseInt(req.body?.destinationIndex)),
        });
    })
);

// route.post("/seticon/:index", asyncHandler(async (req, res) => {
//     res.json({
//         status: "success",
//         data: await buttonSetIcon("source", req.params?.index, req.body?.icon, req.body?.color),
//     });
// }));


module.exports = route;
