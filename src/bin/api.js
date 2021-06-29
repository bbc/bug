const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const helmet = require("helmet");
const httpLogger = require("@utils/http-logger");

//Passporty Auth Stuff
const passportStrategies = require("@utils/passportStrategies");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// import environment variables from .env file
require("dotenv").config();

// get environment
const nodeEnv = process.env.NODE_ENV || "production";
const sessionSecret = process.env.SESSION_SECRET || "buggy";

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

const store = new MongoDBStore({
    uri: "mongodb://bug-mongo:27017/bug-core",
    collection: "sessions",
});

bugApi.use(
    require("express-session")({
        secret: sessionSecret,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

for (let eachStrategy of passportStrategies) {
    passport.use(eachStrategy.name, eachStrategy.strategy);
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//Configure Passport
bugApi.use(passport.initialize());
bugApi.use(passport.session());

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

bugApi.use(favicon(path.join(__dirname, "..", "client", "public", "favicon.ico")));

bugApi.use(express.json());
bugApi.use(express.urlencoded({ extended: false }));
bugApi.use(cookieParser());

bugApi.use("/documentation", documentation);
bugApi.use("/container", proxyRouter);
bugApi.use("/api/icons", iconsRouter);
bugApi.use("/api/module", moduleRouter);
bugApi.use("/api/panel", panelRouter);
bugApi.use("/api/user", userRouter);
bugApi.use("/api/login", loginRouter);
bugApi.use("/api/panelconfig", panelConfigRouter);
bugApi.use("/api/system", systemRouter); // Auth on a per route basis
bugApi.use("/api/bug", bugRouter); // Open to all - just quotes
bugApi.use("/api/logout", logoutRouter); // Open to all - just logout
bugApi.use("/api/strategy", strategyRouter); // Auth on a per route basis

if (nodeEnv === "production") {
    // production: include react build static client files
    bugApi.use(express.static(path.join(__dirname, "..", "client", "build")));

    // production: serve react frontend for bug on the default route
    bugApi.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
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
