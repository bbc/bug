//NAME: auth.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: Middleware to check auth status on routes

const strategyGetEnabledCount = require("@services/strategy-getenabledcount");
const checkUserRoles = require("@services/user-roles-check");
const hashResponse = require("@core/hash-response");
const userGet = require("@services/user-get");

const restrictedTo = (roles) => {
    const checkCredentials = async (req, res, next) => {
        //Check if any stragetgies are enabled
        if ((await strategyGetEnabledCount()) === 0) {
            req.logout();
            return next();
        }

        //Check if user has been authenticated by passport
        if (req.isAuthenticated()) {
            //Gets up to date info on the user
            const user = await userGet(req.user);

            //Check if the user has the correct roles
            if (!checkUserRoles(roles, user?.roles)) {
                return hashResponse(res, req, {
                    status: "failure",
                    message: `Sorry to BUG but you don't have any of these roles - ${roles.toString()}.`,
                    data: req?.user,
                });
            }
            return next();
        }

        //User must not pass. Give them the news
        return hashResponse(res, req, {
            status: "failure",
            message: `Sorry to BUG but you're not authorised, please log in.`,
            data: req?.user,
        });
    };

    return checkCredentials;
};

module.exports = {
    to: restrictedTo,
};
