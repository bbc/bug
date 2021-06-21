//NAME: passport.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: BUG core auth strategies defined here

const HeaderStrategy = require("passport-http-header-strategy").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const SamlStrategy = require("passport-saml").Strategy;

const authHeader = "BBCEMAIL";
const strategyModel = require("@models/strategy");
const userModel = require("@models/user");
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
exports.local = new LocalStrategy(async (username, password, done) => {
    const strategy = strategyModel.get("proxy");
    if (strategy.state !== "active") {
        return done(null, false);
    }
    const user = await userModel.get(username.toLowerCase());

    if (err) {
        return done(err);
    }
    if (!user) {
        return done(null, false);
    }
    if (user.password !== password) {
        return done(null, false);
    }
    delete user["password"];
    delete user["pin"];
    return done(null, user);
});
