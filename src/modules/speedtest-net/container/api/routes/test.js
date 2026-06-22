const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");

const startTest = require("@services/test-start");
const statusTest = require("@services/test-status");
const resultsTest = require("@services/test-results");
const deleteTest = require("@services/test-delete");
const deleteAllTest = require("@services/test-delete-all");
const clearStats = require("@services/stats-clear");

route.get(
    "/start",
    asyncHandler(async (req, res) => {
        const result = await startTest();
        res.json({
            status: "success",
            data: result,
            message: "Speedtest started",
        });
    })
);

route.get(
    "/status",
    asyncHandler(async (req, res) => {
        const result = await statusTest();
        res.json({
            status: "success",
            data: result,
        });
    })
);

route.post(
    "/result/:limit",
    asyncHandler(async (req, res) => {
        const result = await resultsTest(req?.params?.limit);
        res.json({
            status: "success",
            data: result,
        });
    })
);

route.delete(
    "/stats",
    asyncHandler(async (req, res) => {
        const result = await clearStats();
        res.json({
            status: "success",
            data: result,
        });
    })
);

route.delete(
    "/result",
    asyncHandler(async (req, res) => {
        const result = await deleteAllTest();
        res.json({
            status: "success",
            data: result,
        });
    })
);

route.delete(
    "/result/:id",
    asyncHandler(async (req, res) => {
        const result = await deleteTest(req?.params?.id);
        res.json({
            status: "success",
            data: result,
        });
    })
);
module.exports = route;
