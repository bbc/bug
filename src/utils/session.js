"use strict";

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const sessionSecret = process.env.SESSION_SECRET || "buggy";

const store = new MongoDBStore({
    uri: "mongodb://bug-mongo:27017/bug-core",
    collection: "sessions",
});

const bugSession = () => {
    return session({
        secret: sessionSecret,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
        store: store,
        resave: false,
        saveUninitialized: false,
    });
};

module.exports = bugSession;
