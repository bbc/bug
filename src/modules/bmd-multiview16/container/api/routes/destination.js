const express = require("express");
const destinationRoute = require("@services/destination-route");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get("/setaudio/:sourceIndex", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await destinationRoute(17, req?.params?.sourceIndex),
    });
}));

router.get("/:destinationIndex/:sourceIndex", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await destinationRoute(req.params?.destinationIndex, req.params?.sourceIndex),
    });
}));

module.exports = router;
