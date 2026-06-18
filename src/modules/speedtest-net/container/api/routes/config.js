const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const configGet = require("@core/config-get");
const configPut = require("@core/config-put");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        try {
            res.json({
                status: "success",
                data: await configGet(),
            });
        } catch (error) {
            throw createError(500, "Failed to fetch panel config");
        }
    })
);

// this is the endpoint used to update the config in the container
// it shouldn't be used by the module client itself
router.put(
    "/",
    asyncHandler(async (req, res) => {
        try {
            res.json({
                status: "success",
                data: await configPut(req.workers, req.body),
            });
        } catch (error) {
            throw createError(500, "Failed to update panel config");
        }
    })
);

module.exports = router;
