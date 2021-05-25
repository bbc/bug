const express = require("express");
const videohubRoute = require("@services/videohub-route");
const route = express.Router();

route.get("/:destination/:source", async function (req, res, next) {
    // try {
    res.json({
        status: "success",
        data: await videohubRoute(req.params?.destination, req.params?.source),
    });
    // } catch (error) {
    //     res.json({
    //         status: "error",
    //         message: "Failed to route",
    //     });
    // }
});

module.exports = route;
