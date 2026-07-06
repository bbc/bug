const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const outputAdd = require("@services/output-add");
const outputDelete = require("@services/output-delete");

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await outputAdd();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.delete(
    "/:outputIndex",
    asyncHandler(async (req, res) => {
        const result = await outputDelete(req.params.outputIndex);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;