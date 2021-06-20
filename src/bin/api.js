const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const helmet = require("helmet");
const httpLogger = require("@utils/http-logger");

// import environment variables from .env file
require("dotenv").config();

// get environment
const nodeEnv = process.env.NODE_ENV || "production";

// load routes
const documentation = require("@middleware/documentation");
const systemRouter = require("@routes/system");
const moduleRouter = require("@routes/module");
const panelRouter = require("@routes/panel");
const panelConfigRouter = require("@routes/panelconfig");
const bugRouter = require("@routes/bug");
const iconsRouter = require("@routes/icons");
const proxyRouter = require("@routes/proxy");
const userRouter = require("@routes/user");

const bugApi = express();

bugApi.set("json spaces", 2);
bugApi.use(httpLogger);
bugApi.use(cors());
bugApi.use(
    helmet.contentSecurityPolicy({
        reportOnly: true,
        directives: {
            "default-src": ["'self'"],
            "base-uri": ["'self'"],
            "block-all-mixed-content": [],
            "font-src": ["'self'", "https:", "http:", "data:"],
            "frame-ancestors": ["'self'"],
            "img-src": ["'self'", "data:"],
            "object-src": ["'none'"],
            "script-src": ["'self'"],
            "script-src-attr": ["'none'"],
            "style-src": ["'self'", "https:", "http:", "'unsafe-inline'"],
            "upgrade-insecure-requests": [],
        },
    })
);

bugApi.use(
    favicon(path.join(__dirname, "..", "client", "public", "favicon.ico"))
);

bugApi.use(express.json());
bugApi.use(express.urlencoded({ extended: false }));
bugApi.use(cookieParser());
bugApi.use(express.static(path.join(__dirname, "public")));

bugApi.use("/documentation", documentation);
bugApi.use("/container", proxyRouter);
bugApi.use("/api/bug", bugRouter);
bugApi.use("/api/icons", iconsRouter);
bugApi.use("/api/system", systemRouter);
bugApi.use("/api/module", moduleRouter);
bugApi.use("/api/panel", panelRouter);
bugApi.use("/api/user", userRouter);
bugApi.use("/api/panelconfig", panelConfigRouter);

//Serve files in the public folder
bugApi.use(express.static(path.join(__dirname, "..", "client", "public")));

// catch 404 and forward to error handler
bugApi.use(function (req, res, next) {
    const err = new Error("File Not Found");
    err.status = 404;
    next(err);
});

// error handler
bugApi.use(function (error, req, res, next) {
    res.status(error.status || 500).json({
        status: error.status,
        message: error.message,
        stack: nodeEnv !== "production" ? error?.stack?.split("\n") : undefined,
    });
});

module.exports = bugApi;
