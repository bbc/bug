const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

const startTest = require("@services/test-start");
const statusTest = require("@services/test-status");
const resultsTest = require("@services/test-results");
const deleteTest = require("@services/test-delete");

route.get(
    "/start",
    asyncHandler(async (req, res) => {
        const result = await startTest();
        hashResponse(res, req, {
            status: result.error ? "failure" : "success",
            ...result,
        });
    })
);

route.get(
    "/status",
    asyncHandler(async (req, res) => {
        const result = await statusTest();
        hashResponse(res, req, {
            status: result.error ? "failure" : "success",
            ...result,
        });
    })
);

route.get(
    "/status",
    asyncHandler(async (req, res) => {
        const result = await statusTest();
        hashResponse(res, req, {
            status: result.error ? "failure" : "success",
            ...result,
        });
    })
);

route.post(
    "/result/:limit",
    asyncHandler(async (req, res) => {
        const result = await resultsTest(req?.params?.limit);
        hashResponse(res, req, {
            status: result.error ? "failure" : "success",
            ...result,
        });
    })
);

route.delete(
    "/result/:id",
    asyncHandler(async (req, res) => {
        const result = await deleteTest(req?.params?.id);
        hashResponse(res, req, {
            status: result.error ? "failure" : "success",
            ...result,
        });
    })
);
module.exports = route;
