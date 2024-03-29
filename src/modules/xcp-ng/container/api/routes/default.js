var express = require("express"),
    defaultRoute = express.Router();

defaultRoute.use("/", function (req, res) {
    var completeURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    let status = {
        request_url: completeURL,
        request_method: req.method,
        request_params: req.query,
        error: "Invalid API route, check the API documentation.",
    };

    res.header("Content-Type", "application/json");
    res.json(status);
});

module.exports = defaultRoute;
