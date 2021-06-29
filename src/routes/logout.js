"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

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
        const email = req?.user?.email;
        const status = await req.logout();

        hashResponse(res, req, {
            status: status ? "failure" : "success",
            message: status ? "Logout failed" : `Sucessfully logged out ${email}`,
            data: status,
        });
    })
);

module.exports = router;
