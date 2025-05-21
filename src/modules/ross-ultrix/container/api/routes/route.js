const express = require("express");
const matrixRoute = require("@services/matrix-route");
const route = express.Router();

route.get("/:destination/:source", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await matrixRoute(req.params?.destination, req.params?.source),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to route",
        });
    }
});

module.exports = route;
