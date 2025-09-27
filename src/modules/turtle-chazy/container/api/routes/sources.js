const express = require("express");
const sourcesList = require("@services/sources-list");
// const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();

// route.post("/:sourceDevice/:destinationDevice/:destinationIndex?", async function (req, res, next) {
route.post("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourcesList(req.body?.sourceDevice, req.body?.destinationDevice, parseInt(req.body?.destinationIndex)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

// route.post("/seticon/:index", async function (req, res, next) {
//     try {
//         res.json({
//             status: "success",
//             data: await buttonSetIcon("source", req.params?.index, req.body?.icon, req.body?.color),
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             status: "error",
//             message: "Failed to get sources",
//         });
//     }
// });


module.exports = route;
