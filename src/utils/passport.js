//NAME: passport.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: BUG core auth strategies defined here

const OAuth2Strategy = require("passport-oauth2").Strategy;
const HeaderStrategy = require("passport-http-header-strategy").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const SamlStrategy = require("passport-saml").Strategy;

const authHeader = "BBCEMAIL";
const strategyModel = require("@models/strategy");
const userModel = require("@models/user");
const userPin = require("@services/user-pin");
const logger = require("@utils/logger")(module);

//Setup Trusted Header authentication
exports.proxy = new HeaderStrategy(
    { header: authHeader, passReqToCallback: true },
    async (request, header, done) => {
        const strategy = strategyModel.get("proxy");
        let auth = false;

        if (strategy.state === "active") {
            const user = await userModel.get(header.toLowerCase());
            if (!user) {
                auth = false;
                logger.info(`Login failed: ${header} is not on the user list.`);
            } else if (user.state === "active") {
                delete user["password"];
                delete user["pin"];
                auth = user;
                logger.debug(`Login sucess: ${user.email} logged on.`);
            } else {
                auth = false;
                logger.info(`Login failed: ${header} is not enabled.`);
            }
        }
        return done(null, auth);
    }
);

//Setup Local authentication
exports.local = new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
        const strategy = await strategyModel.get("local");
        if (strategy.state !== "active") {
            logger.info(`Local login not enabled.`);
            return done(null, false);
        }
        const user = await userModel.get(username.toLowerCase());

        if (!user) {
            logger.info(`Local login: User '${username}' does not exist.`);
            return done(null, false);
        }
        if (user.password !== password) {
            logger.info(`Local login: Wrong password for ${username}.`);
            return done(null, false);
        }
        delete user["password"];
        delete user["pin"];
        logger.action(`Local login: ${username} logged in.`);
        return done(null, user);
    }
);

//Setup Pin authentication
exports.pin = new LocalStrategy(
    { usernameField: "pin", passwordField: "pin" },
    async (username, password, done) => {
        const strategy = await strategyModel.get("pin");
        if (strategy.state !== "active") {
            logger.info(`Pin login not enabled.`);
            return done(null, false);
        }
        const user = await userPin(username);

        if (!user) {
            logger.info(`Pin login: User does not exist.`);
            return done(null, false);
        }
        if (user.pin !== password) {
            logger.info(`Pin login: Wrong pin for ${user?.email}.`);
            return done(null, false);
        }
        delete user["password"];
        delete user["pin"];
        logger.action(`Pin login: ${user?.email} logged in.`);
        return done(null, user);
    }
);

//Setup OAuth authentication
exports.oauth = new OAuth2Strategy(
    {
        authorizationURL: "https://bbclogin.id.tools.bbc.co.uk",
        tokenURL: "https://bbclogin.id.tools.bbc.co.uk/token",
        clientID: "ID",
        clientSecret: "SECRET",
        callbackURL: "http://localhost:3000/auth/example/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        const strategy = await strategyModel.get("pin");
        if (strategy.state !== "active") {
            logger.info(`OAuth2 login: Not enabled.`);
            return done(null, false);
        }
        const user = await userModel(profile?.email);

        if (!user) {
            logger.info(`OAuth2 login: User does not exist.`);
            return done(null, false);
        }

        delete user["password"];
        delete user["pin"];
        logger.action(`OAuth2 login: ${user?.email} logged in.`);
        return done(null, user);
    }
);
