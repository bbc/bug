const express = require("express");
const router = express.Router();
const outputDelete = require("@services/output-delete");
const outputAdd = require("@services/output-add");

router.delete("/:outputIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await outputDelete(req.params.outputIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete output channel",
        });
    }
});

router.post("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await outputAdd(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add output channel",
        });
    }
});

module.exports = router;
