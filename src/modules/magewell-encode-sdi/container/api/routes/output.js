const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const outputAdd = require("@services/output-add");
const outputDelete = require("@services/output-delete");

router.post(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await outputAdd(),
        });
    })
);

router.delete(
    "/:outputIndex",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await outputDelete(req.params.outputIndex),
        });
    })
);

module.exports = router;