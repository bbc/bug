const express = require("express");
const router = express.Router();
const audioDelete = require("@services/audio-delete");
const audioAdd = require("@services/audio-add");

router.delete("/:trackIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await audioDelete(req.params.trackIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete audio track",
        });
    }
});

router.post("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await audioAdd(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add audio track",
        });
    }
});

module.exports = router;
