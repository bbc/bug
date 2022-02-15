const express = require("express");
const destinationRoute = require("@services/destination-route");
const router = express.Router();

router.get("/setaudio/:sourceIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationRoute(17, req?.params?.sourceIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set audio solo",
        });
    }
});

router.get("/:destinationIndex/:sourceIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationRoute(req.params?.destinationIndex, req.params?.sourceIndex),
        });
    } catch (error) {
        res.json({
            status: "error",
            message: "Failed to route",
        });
    }
});

module.exports = router;
