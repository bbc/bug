const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const helmet = require("helmet");
const httpLogger = require("@utils/http-logger");
const passport = require("passport");
const session = require("@utils/session");

// load environment variables
require("dotenv").config();
const nodeEnv = process.env.NODE_ENV || "production";

// import routes
const documentation = require("@middleware/documentation");
const systemRouter = require("@routes/system");
const moduleRouter = require("@routes/module");
const panelRouter = require("@routes/panel");
const panelGroupRouter = require("@routes/panelgroup");
const panelConfigRouter = require("@routes/panelconfig");
const bugRouter = require("@routes/bug");
const iconsRouter = require("@routes/icons");
const proxyRouter = require("@routes/proxy");
const userRouter = require("@routes/user");
const loginRouter = require("@routes/login");
const logoutRouter = require("@routes/logout");
const strategyRouter = require("@routes/strategy");
const logRouter = require("@routes/log");

const bugApi = express();

// auth setup
bugApi.use(session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
bugApi.use(passport.initialize());
bugApi.use(passport.session());

// middleware
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
bugApi.use(fileUpload({ useTempFiles: true, tempFileDir: "./data" }));
bugApi.use(express.json());
bugApi.use(express.urlencoded({ extended: false }));
bugApi.use(cookieParser());

// API Routes
bugApi.use("/container", proxyRouter);
bugApi.use("/api/icons", iconsRouter);
bugApi.use("/api/module", moduleRouter);
bugApi.use("/api/panel", panelRouter);
bugApi.use("/api/user", userRouter);
bugApi.use("/api/panelconfig", panelConfigRouter);
bugApi.use("/api/panelgroup", panelGroupRouter);
bugApi.use("/api/system", systemRouter);
bugApi.use("/api/bug", bugRouter);
bugApi.use("/api/login", loginRouter);
bugApi.use("/api/logout", logoutRouter);
bugApi.use("/api/strategy", strategyRouter);
bugApi.use("/api/log", logRouter);

// redirect root API path
bugApi.get("/api", (req, res) => {
    res.redirect("/api/documentation");
});

// documentation
bugApi.use("/api/documentation", documentation);

if (nodeEnv === "production") {
    const root = path.join(__dirname, "..", "..", "client", "dist");

    bugApi.use(express.static(root));

    // serve favicon from dist
    bugApi.use(favicon(path.join(root, "icons", "favicon.ico")));

    // spa fallback
    bugApi.get("*", (req, res) => {
        res.sendFile("index.html", { root });
    });
}
else {
    // favicon
    bugApi.use(
        favicon(path.join(__dirname, "..", "..", "client", "public", "icons", "favicon.ico"))
    );
}


// error handling
bugApi.use((req, res, next) => {
    const err = new Error("File Not Found");
    err.status = 404;
    next(err);
});

bugApi.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error"
    });
});

module.exports = bugApi;
