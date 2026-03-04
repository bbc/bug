var express = require("express"),
    defaultRoute = express.Router();

defaultRoute.use("/", function (req, res) {
    const completeURL = req.protocol + "://" + req.get("host") + req.originalUrl;

    res.status(404).json({
        request_url: completeURL,
        request_method: req.method,
        request_params: req.query,
        error: "Invalid API route, check the API documentation."
    });
});

module.exports = defaultRoute;
