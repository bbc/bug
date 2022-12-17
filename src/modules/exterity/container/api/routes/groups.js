const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();
const groupList = require("@services/group-list");

route.all(
    "/",
    asyncHandler(async (req, res) => {
        const results = await groupList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

module.exports = route;
