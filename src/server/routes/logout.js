"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const userGet = require("@services/user-get");

const logoutAsync = async (req) => {
    if (typeof req?.logout !== "function") {
        return null;
    }

    if (req.logout.length > 0) {
        return new Promise((resolve, reject) => {
            req.logout((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(null);
            });
        });
    }

    return req.logout();
};
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
        const user = await userGet(req?.user);
        let status = null;

        try {
            await logoutAsync(req);
        } catch (error) {
            status = error;
        }

        hashResponse(res, req, {
            status: status ? "failure" : "success",
            message: status ? "Logout failed" : `Sucessfully logged out ${user?.username}`,
            data: status,
        });
    })
);

module.exports = router;
