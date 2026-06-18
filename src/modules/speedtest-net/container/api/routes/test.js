const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const hashResponse = require("@core/hash-response");

const startTest = require("@services/test-start");
const statusTest = require("@services/test-status");
const resultsTest = require("@services/test-results");
const deleteTest = require("@services/test-delete");
const deleteAllTest = require("@services/test-delete-all");
const clearStats = require("@services/stats-clear");

const getServiceDataOrThrow = (result, fallbackMessage) => {
    if (result?.error) {
        const message = result?.error?.message || result?.error || fallbackMessage;
        throw createError(500, message);
    }

    return result?.data;
};

route.get(
    "/start",
    asyncHandler(async (req, res) => {
        const result = await startTest();
        hashResponse(res, req, {
            status: "success",
            data: getServiceDataOrThrow(result, "Failed to start speedtest"),
            message: result?.message,
        });
    })
);

route.get(
    "/status",
    asyncHandler(async (req, res) => {
        const result = await statusTest();
        hashResponse(res, req, {
            status: "success",
            data: getServiceDataOrThrow(result, "Failed to fetch test status"),
        });
    })
);

route.post(
    "/result/:limit",
    asyncHandler(async (req, res) => {
        const result = await resultsTest(req?.params?.limit);
        hashResponse(res, req, {
            status: "success",
            data: getServiceDataOrThrow(result, "Failed to fetch test results"),
        });
    })
);

route.delete(
    "/stats",
    asyncHandler(async (req, res) => {
        const result = await clearStats();
        hashResponse(res, req, {
            status: "success",
            data: getServiceDataOrThrow(result, "Failed to clear graph stats"),
        });
    })
);

route.delete(
    "/result",
    asyncHandler(async (req, res) => {
        const result = await deleteAllTest();
        hashResponse(res, req, {
            status: "success",
            data: getServiceDataOrThrow(result, "Failed to delete all test results"),
        });
    })
);

route.delete(
    "/result/:id",
    asyncHandler(async (req, res) => {
        const result = await deleteTest(req?.params?.id);
        hashResponse(res, req, {
            status: "success",
            data: getServiceDataOrThrow(result, "Failed to delete test result"),
        });
    })
);
module.exports = route;
