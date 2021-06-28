//NAME: auth.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: Middleware to check auth status on routes

const checkUserRoles = require("@services/user-roles-check");
const hashResponse = require("@core/hash-response");

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return hashResponse(res, req, {
            status: "failed",
            message: `Sorry to BUG but you're not authorised, please log in.`,
            data: req?.user,
        });
    }

    if (!checkUserRoles("admin", req.user.roles)) {
        return hashResponse(res, req, {
            status: "failed",
            message: `Sorry to BUG but you're not authorised, please log in.`,
            data: req?.user,
        });
    }

    next();
};

module.exports = isAuthenticated;
