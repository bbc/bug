const express = require("express");
const router = express.Router();
const destinationList = require("@services/destination-list");
const destinationRoute = require("@services/destination-route");

router.get("/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationList(req.params?.groupIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations list",
        });
    }
});

router.get("/route/:destination/:source", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationRoute(req.params?.destination, req.params?.source),
        });
    } catch (error) {
        res.json({
            status: "error",
            message: "Failed to route",
        });
    }
});
module.exports = router;
