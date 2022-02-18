const express = require("express");
const labelList = require("@services/label-list");
const labelSet = require("@services/label-set");
const labelGetRouterOutputs = require("@services/label-getrouteroutputs");
const labelSetAutoState = require("@services/label-setautostate");
const labelSetAutoIndex = require("@services/label-setautoindex");
const router = express.Router();

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await labelList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get label list",
        });
    }
});

router.get("/getrouteroutputs", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await labelGetRouterOutputs(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get label list",
        });
    }
});

router.post("/set", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await labelSet(req?.body?.inputIndex, req?.body?.label),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label",
        });
    }
});

router.post("/setautostate", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await labelSetAutoState(req?.body?.inputIndex, req?.body?.state),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set auto label state",
        });
    }
});

router.post("/setautoindex", async function (req, res, next) {
    try {
        const result = await labelSetAutoIndex(req?.body?.inputIndex, req?.body?.routerIndex);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set auto label index",
        });
    }
});

module.exports = router;
