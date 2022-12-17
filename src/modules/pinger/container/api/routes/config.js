const express = require("express");
const router = express.Router();
const configGet = require("@core/config-get");
const configPut = require("@core/config-put");
const hostClean = require("@services/host-clean");

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await configGet(),
        });
    } catch (error) {
        res.json({
            status: "error",
            message: "Failed to fetch panel config",
        });
    }
});

// this is the endpoint used to update the config in the container
// it shouldn't be used by the module client itself
router.put("/", async function (req, res, next) {
    try {
        let state = hostClean(req.body?.hosts);
        state = configPut(req.workers, req.body);
        res.json({
            status: state ? "success" : "failure",
            data: state,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: "Failed to update panel config",
        });
    }
});

module.exports = router;
