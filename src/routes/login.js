"use strict";

const router = require("express").Router();
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

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
router.post(
    "/",
    passport.authenticate("local"),
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: req.user ? "success" : "fail",
            message: req.user
                ? `Sucessfully logged in ${req.user.email}`
                : "Login failed",
            data: req.user,
        });
    })
);

module.exports = router;
