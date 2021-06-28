"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const passport = require("passport");

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
router.post("/", (req, res, next) => {
    passport.authenticate(["local", "pin"], (err, user, info) => {
        if (err) return next(err);

        return hashResponse(res, req, {
            status: user ? "success" : "fail",
            message: user ? `Sucessfully logged in ${user.name}` : "Login failed",
            data: user,
        });
    })(req, res, next);
});

module.exports = router;
