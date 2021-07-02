//NAME: passport.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: BUG core auth strategies defined here
//BROKEN

const OAuth2Strategy = require("passport-oauth2").Strategy;
const HeaderStrategy = require("passport-http-header-strategy").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const SamlStrategy = require("passport-saml").Strategy;

const logger = require("@utils/logger")(module);
const userGetByPin = require("@services/user-get-by-pin");
const userGetByUsername = require("@services/user-get-by-username");
const ipCompare = require("@utils/ip-compare");
const bcrypt = require("bcryptjs");

//Setup Trusted Header authentication
const proxyStrategy = (settings) => {
    return new HeaderStrategy(
        { header: "BBCEMAIL", passReqToCallback: true, passReqToCallback: true },
        async (req, header, done) => {
            const user = await userEmail(header.toLowerCase());

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`Pin login: IP Address ${req.ip} is not in the source list.`);
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
            const user = await userGetByUsername(username.toLowerCase());

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`Pin login: IP Address ${req.ip} is not in the source list.`);
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
            const user = await userGetByPin(username);

            //Check Traffic Source Filter
            if (!(await ipCompare(req?.ip, settings?.sourceFilterList))) {
                logger.info(`Pin login: IP Address ${req.ip} is not in the source list.`);
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

            logger.action(`Pin login: ${user?.username} logged in.`);
            return done(null, user.id);
        }
    );
};

// setup SAML authentication
// passport.use(new SamlStrategy(
//     {
//       path: '/login/callback',
//       entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
//       issuer: 'passport-saml'
//     },
//     function(profile, done) {
//       findByEmail(profile.email, function(err, user) {
//         if (err) {
//           return done(err);
//         }
//         return done(null, user);
//       });
//     })
//   );

//Setup OAuth authentication
// const oauthStrategy = new OAuth2Strategy(
//     {
//         authorizationURL: "https://bbclogin.id.tools.bbc.co.uk",
//         tokenURL: "https://bbclogin.id.tools.bbc.co.uk/token",
//         clientID: "ID",
//         clientSecret: "SECRET",
//         callbackURL: "http://localhost:3000/auth/example/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         const strategy = await strategyModel.get("pin");
//         if (!strategy.enabled) {
//             logger.info(`OAuth2 login: Not enabled.`);
//             return done(null, false);
//         }
//         const user = await userEmail(profile?.email);

//         if (!user) {
//             logger.info(`OAuth2 login: User '${profile.email}' does not exist.`);
//             return done(null, false);
//         }

//         if (!user.enabled) {
//             logger.info(`OAuth2 login: User '${user?.username}' is not enabled.`);
//             return done(null, false);
//         }

//         logger.action(`OAuth2 login: ${user?.username} logged in.`);
//         return done(null, user.id);
//     }
// );

module.exports = {
    local: localStrategy,
    pin: pinStrategy,
    proxy: proxyStrategy,
};
