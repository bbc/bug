//NAME: passport.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: BUG core auth strategies defined here

const HeaderStrategy = require("passport-http-header-strategy").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const SamlStrategy = require("passport-saml").Strategy;
const OpenIdStrategy = require("passport-openid").Strategy;

const logger = require("@utils/logger")(module);
const userGetByFeild = require("@services/user-get-by-feild");
const ipCompare = require("@utils/ip-compare");
const ipClean = require("@utils/ip-clean");
const bcrypt = require("bcryptjs");

//Setup Trusted Header authentication
const proxyStrategy = (settings) => {
    return new HeaderStrategy(
        { header: settings?.headerField, passReqToCallback: true, passReqToCallback: true },
        async (req, header, done) => {
            const user = await userGetByFeild(header.toLowerCase(), settings?.headerFieldMatch);

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`Pin login: IP Address ${await ipClean(req?.ip)} is not in the source list.`);
                return done(null, false);
            }

            if (!user) {
                logger.info(`Proxy login: User with email '${header.toLowerCase()}' does not exist.`);
                return done(null, false);
            }

            if (!user.enabled) {
                logger.info(`Proxy login: User '${user?.username}' is not enabled.`);
                return done(null, false);
            }

            //Set Session Length
            req.session.cookie.maxAge = parseInt(settings?.sessionLength);

            logger.action(`Proxy login: ${user?.username} logged in.`);

            return done(null, user.id);
        }
    );
};

//Setup Local authentication
const localStrategy = (settings) => {
    return new LocalStrategy(
        { usernameField: "username", passwordField: "password", passReqToCallback: true },
        async (req, username, password, done) => {
            const user = await userGetByFeild(username.toLowerCase(), "username");

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`Local login: IP Address ${await ipClean(req?.ip)} is not in the source list.`);
                return done(null, false);
            }

            if (!user) {
                logger.info(`Local login: User '${username}' does not exist.`);
                return done(null, false);
            }

            if (!user.enabled) {
                logger.info(`Local login: User '${user?.username}' is not enabled.`);
                return done(null, false);
            }

            if (!(await bcrypt.compare(password, user.password))) {
                logger.info(`Local login: Wrong password for ${user?.username}.`);
                return done(null, false);
            }

            //Set Session Length
            req.session.cookie.maxAge = parseInt(settings?.sessionLength);

            logger.action(`Local login: ${user?.username} logged in.`);
            return done(null, user.id);
        }
    );
};

//Setup Pin authentication
const pinStrategy = (settings) => {
    return new LocalStrategy(
        { usernameField: "pin", passwordField: "pin", passReqToCallback: true },
        async (req, username, password, done) => {
            const user = await userGetByFeild(username, "pin");

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`Pin login: IP Address ${await ipClean(req?.ip)} is not in the source list.`);
                return done(null, false);
            }

            if (!user) {
                logger.info(`Pin login: User does not exist.`);
                return done(null, false);
            }

            if (!user.enabled) {
                logger.info(`Pin login: User '${user?.username}' is not enabled.`);
                return done(null, false);
            }

            //Set Session Length
            req.session.cookie.maxAge = parseInt(settings?.sessionLength);

            logger.action(`Pin login: ${user?.username} logged in.`);
            return done(null, user.id);
        }
    );
};

//Setup SAML authentication
const samlStrategy = (settings) => {
    return new SamlStrategy(
        {
            path: "/login/callback",
            entryPoint: settings?.entryPoint,
            issuer: settings?.issuer,
            passReqToCallback: true,
        },
        async (req, profile, done) => {
            console.log(`SAML login: ${profile}`);

            const user = await userGetByFeild(profile.toLowerCase(), "email");

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`SAML login: IP Address ${await ipClean(req?.ip)} is not in the source list.`);
                return done(null, false);
            }

            if (!user) {
                logger.info(`SAML login: User '${username}' does not exist.`);
                return done(null, false);
            }

            if (!user.enabled) {
                logger.info(`SAML login: User '${user?.username}' is not enabled.`);
                return done(null, false);
            }

            if (!(await bcrypt.compare(password, user.password))) {
                logger.info(`SAML login: Wrong password for ${user?.username}.`);
                return done(null, false);
            }

            //Set Session Length
            req.session.cookie.maxAge = parseInt(settings?.sessionLength);

            logger.action(`SAML login: ${user?.username} logged in.`);
            return done(null, user.id);
        }
    );
};

//Setup OpenID (OIDC) authentication
const oidcStrategy = (settings) => {
    return new OpenIDStrategy(
        {
            returnURL: settings?.returnURL,
            realm: settings?.realm,
            passReqToCallback: true,
        },
        async (req, identifier, done) => {
            console.log(`OIDC login: ${identifier}`);

            const user = await userGetByFeild(username.toLowerCase(), "username");

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`OIDC login: IP Address ${await ipClean(req?.ip)} is not in the source list.`);
                return done(null, false);
            }

            if (!user) {
                logger.info(`OIDC login: User '${username}' does not exist.`);
                return done(null, false);
            }

            if (!user.enabled) {
                logger.info(`OIDC login: User '${user?.username}' is not enabled.`);
                return done(null, false);
            }

            if (!(await bcrypt.compare(password, user.password))) {
                logger.info(`OIDC login: Wrong password for ${user?.username}.`);
                return done(null, false);
            }

            //Set Session Length
            req.session.cookie.maxAge = parseInt(settings?.sessionLength);

            logger.action(`OIDC login: ${user?.username} logged in.`);
            return done(null, user.id);
        }
    );
};

module.exports = {
    local: localStrategy,
    pin: pinStrategy,
    proxy: proxyStrategy,
    saml: samlStrategy,
    oidc: oidcStrategy,
};
