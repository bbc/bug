"use strict";

const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const passport = require("passport");
const getUser = require("@services/user-get");
const strategyList = require("@services/strategy-list");
const passportStrategies = require("@utils/passportStrategies");

/**
 * @swagger
 * /login:
 *   post:
 *     description: Creates a login session for the BUG API
 *     tags: [login]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: email
 *         type: string
 *         description: Email
 *         required: false
 *       - in: formData
 *         name: username
 *         type: string
 *         description: Username
 *         required: false
 *       - in: formData
 *         name: password
 *         type: string
 *         description: Password
 *         required: false
 *       - in: formData
 *         name: pin
 *         type: string
 *         description: Pin
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully logged in user.
 *         schema:
 *           type: object
 */

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: "failure",
        message: "Too many login attempts. Please try again later.",
    },
});

router.post("/", loginRateLimiter, async (req, res, next) => {
    const strategies = await strategyList();
    const configuredStrategies = [];

    for (let strategy of strategies) {
        if (strategy?.enabled) {
            const configuredStrategy = await passportStrategies[strategy.type](strategy);
            configuredStrategies.push(configuredStrategy);
        }
    }

    passport.authenticate(configuredStrategies, async (err, id, info) => {
        if (err) {
            return next(err);
        }
        if (!id) {
            return hashResponse(res, req, {
                status: "failure",
                message: "Login failed.",
                data: id,
            });
        }

        const user = await getUser(id);

        req.logIn(id, function (err) {
            if (err) {
                return next(err);
            }
            return hashResponse(res, req, {
                status: user ? "success" : "failure",
                message: user ? `Sucessfully logged in ${user.username}` : "Login failed",
                data: user,
            });
        });
    })(req, res, next);
});

module.exports = router;
