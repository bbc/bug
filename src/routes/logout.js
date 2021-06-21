"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");

/**
 * @swagger
 * /logout:
 *   post:
 *     description: Clears any session cookies to log a user out.
 *     tags: [login]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully logged the user out.
 *         schema:
 *           type: object
 */
router.post(
    "/",
    asyncHandler(async (req, res) => {
        await req.logout();
        res.redirect("/login");
    })
);

module.exports = router;
