"use strict";

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const sessionSecret = process.env.SESSION_SECRET || "buggy";
const databaseName = process.env.BUG_CONTAINER || "bug";

const mongoContainer = process.env.MONGO_CONTAINER || "mongo";
const mongoPort = process.env.MONGO_PORT || "27017";
const url = `mongodb://${mongoContainer}:${mongoPort}`;

const store = new MongoDBStore({
    uri: `${url}/${databaseName}`,
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
