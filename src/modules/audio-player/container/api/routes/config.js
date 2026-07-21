const express = require("express");
const router = express.Router();
const configGet = require("@core/config-get");
const configPut = require("@core/config-put");
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await configGet(),
    });
}));

// this is the endpoint used to update the config in the container
// it shouldn't be used by the module client itself
router.put("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await configPut(req.workers, req.body),
    });
}));

module.exports = router;
