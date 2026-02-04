const express = require("express");
const labelList = require("@services/label-list");
const labelSet = require("@services/label-set");
const labelGetRouterOutputs = require("@services/label-getrouteroutputs");
const labelSetAutoState = require("@services/label-setautostate");
const labelSetAutoIndex = require("@services/label-setautoindex");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.all("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await labelList(),
    });
}));

router.get("/getrouteroutputs", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await labelGetRouterOutputs(),
    });
}));

router.post("/set", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await labelSet(req?.body?.inputIndex, req?.body?.label),
    });
}));

router.post("/setautostate", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await labelSetAutoState(req?.body?.inputIndex, req?.body?.state),
    });
}));

router.post("/setautoindex", asyncHandler(async (req, res) => {
    const result = await labelSetAutoIndex(req?.body?.inputIndex, req?.body?.routerIndex);
    res.json({
        status: result ? "success" : "failure",
        data: result,
    });
}));

module.exports = router;
