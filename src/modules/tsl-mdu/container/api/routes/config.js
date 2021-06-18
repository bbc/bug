const express = require("express");
const router = express.Router();
const configGet = require("@core/config-get");
const configPut = require("@core/config-put");
const hashResponse = require("@core/hash-response");

router.get("/", async function (req, res, next) {
    try {
        hashResponse(res, req, {
            status: "success",
            data: await configGet(),
        });
    } catch (error) {
        hashResponse(res, req, {
            status: "error",
            message: "Failed to fetch panel config",
        });
    }
});

// this is the endpoint used to update the config in the container
// it shouldn't be used by the module client itself
router.put("/", async function (req, res, next) {
    try {
        hashResponse(res, req, {
            status: "success",
            data: await configPut(req.workers, req.body),
        });
    } catch (error) {
        hashResponse(res, req, {
            status: "error",
            message: "Failed to update panel config",
        });
    }
});

module.exports = router;
