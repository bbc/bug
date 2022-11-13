const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();
const deviceAdd = require("@services/device-add");
const deviceDetails = require("@services/device-details");
const deviceList = require("@services/device-list");
const deviceUpdate = require("@services/device-update");
const deviceDelete = require("@services/device-delete");
const deviceReboot = require("@services/device-reboot");

route.get(
    "/",
    asyncHandler(async (req, res) => {
        const results = await deviceList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/list",
    asyncHandler(async (req, res) => {
        const results = await deviceList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:deviceId",
    asyncHandler(async (req, res) => {
        const results = await deviceDetails(req.params?.deviceId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:deviceId/reboot",
    asyncHandler(async (req, res) => {
        const results = await deviceReboot(req.params?.deviceId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.put(
    "/:deviceId",
    asyncHandler(async (req, res) => {
        const results = await deviceUpdate(req.params?.deviceId, req.body);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await deviceAdd(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.delete(
    "/:deviceId",
    asyncHandler(async (req, res) => {
        const results = await deviceDelete(req.params?.deviceId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);
module.exports = route;
