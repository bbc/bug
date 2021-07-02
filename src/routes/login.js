"use strict";

const router = require("express").Router();
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
router.post("/", async (req, res, next) => {
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
