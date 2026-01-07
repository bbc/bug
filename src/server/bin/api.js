const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const helmet = require("helmet");
const httpLogger = require("@utils/http-logger");

// passporty auth stuff
const passport = require("passport");
const session = require("@utils/session");

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
const loginRouter = require("@routes/login");
const logoutRouter = require("@routes/logout");
const strategyRouter = require("@routes/strategy");

const bugApi = express();

bugApi.use(session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// configure passport
bugApi.use(passport.initialize());
bugApi.use(passport.session());

bugApi.set("json spaces", 2);
bugApi.use(httpLogger);
bugApi.use(cors());
bugApi.use(
    helmet.contentSecurityPolicy({
        reportOnly: true,
        directives: {
            upgradeInsecureRequests: null,
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "https:", "http:", "'unsafe-inline'"],
            defaultSrc: ["'self'"],
            "base-uri": ["'self'"],
            "block-all-mixed-content": [],
            "font-src": ["'self'", "https:", "http:", "data:"],
            "frame-ancestors": ["'self'"],
            "img-src": ["'self'", "data:", "https:"],
            "object-src": ["'none'"],
        },
    })
);

bugApi.use(favicon(path.join(__dirname, "..", "..", "client", "public", "icons", "favicon.ico")));
bugApi.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./data",
    })
);

bugApi.use(express.json());
bugApi.use(express.urlencoded({ extended: false }));
bugApi.use(cookieParser());

bugApi.use("/documentation", documentation);
bugApi.use("/container", proxyRouter);
bugApi.use("/api/icons", iconsRouter);
bugApi.use("/api/module", moduleRouter);
bugApi.use("/api/panel", panelRouter);
bugApi.use("/api/user", userRouter);
bugApi.use("/api/panelconfig", panelConfigRouter);
bugApi.use("/api/system", systemRouter); // Auth on a per route basis
bugApi.use("/api/bug", bugRouter); // Open to all - just quotes
bugApi.use("/api/login", loginRouter);
bugApi.use("/api/logout", logoutRouter); // Open to all - just logout
bugApi.use("/api/strategy", strategyRouter); // Auth on a per route basis

// redirect /api to /documentation
bugApi.use("/api", function (req, res, next) {
    res.redirect("/documentation");
});

if (nodeEnv === "production") {
    const root = require("path").join(__dirname, "..", "client", "build");

    // production: include react build static client files
    bugApi.use(express.static(root));

    // production: serve react frontend for bug on the default route
    bugApi.get("*", (req, res) => {
        res.sendFile("index.html", { root });
    });
} else {
    // development: serve files in the public folder
    bugApi.use(express.static(path.join(__dirname, "..", "client", "public")));
}

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
