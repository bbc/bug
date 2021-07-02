//NAME: passport.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: BUG core auth strategies defined here
//BROKEN

const OAuth2Strategy = require("passport-oauth2").Strategy;
const HeaderStrategy = require("passport-http-header-strategy").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const SamlStrategy = require("passport-saml").Strategy;

const strategyModel = require("@models/strategies");
const userGetByPin = require("@services/user-get-by-pin");
const userGetByUsername = require("@services/user-get-by-username");
const logger = require("@utils/logger")(module);
const bcrypt = require("bcryptjs");

//Setup Trusted Header authentication
const proxyStrategy = new HeaderStrategy(
    { header: "BBCEMAIL", passReqToCallback: true },
    async (request, header, done) => {
        const strategy = strategyModel.get("proxy");
        let auth = false;

        if (!strategy.enabled) {
            const user = await userEmail(header.toLowerCase());
            if (!user) {
                auth = false;
                logger.info(`Login failed: ${header} is not on the user list.`);
            } else if (user.enabled) {
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
const localStrategy = new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
        const strategy = await strategyModel.get("local");
        if (!strategy.enabled) {
            logger.info(`Local login not enabled.`);
            return done(null, false);
        }
        const user = await userGetByUsername(username.toLowerCase());

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

//Setup Pin authentication
const pinStrategy = new LocalStrategy(
    { usernameField: "pin", passwordField: "pin" },
    async (username, password, done) => {
        const strategy = await strategyModel.get("pin");

        if (!strategy.enabled) {
            logger.info(`Pin login not enabled.`);
            return done(null, false);
        }
        const user = await userGetByPin(username);
        //TODO IP Whitelisting

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

module.exports = [
    {
        name: "local",
        strategy: localStrategy,
    },
    {
        name: "pin",
        strategy: pinStrategy,
    },
    {
        name: "proxy",
        strategy: proxyStrategy,
    },
];
