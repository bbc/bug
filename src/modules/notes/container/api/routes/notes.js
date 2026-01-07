const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();

const noteAdd = require("@services/note-add");
const noteList = require("@services/note-list");
const noteUpdate = require("@services/note-update");
const noteDelete = require("@services/note-delete");
const noteGet = require("@services/note-get");

route.get(
    "/",
    asyncHandler(async (req, res) => {
        const results = await noteList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:noteId",
    asyncHandler(async (req, res) => {
        const results = await noteGet(req.params?.noteId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.put(
    "/:noteId",
    asyncHandler(async (req, res) => {
        const results = await noteUpdate(req.params?.noteId, req.body);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await noteAdd();
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.delete(
    "/:noteId",
    asyncHandler(async (req, res) => {
        const results = await noteDelete(req.params?.noteId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

module.exports = route;
