"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const userDelete = require("@services/user-delete");
const userSet = require("@services/user-set");
const userUpdate = require("@services/user-update");
const usersGet = require("@services/users-get");
const userGet = require("@services/user-get");
const userState = require("@services/user-state");

/**
 * @swagger
 * /user/{email}:
 *   delete:
 *     description: Deletes a user from BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's fully qualified email address.
 *     responses:
 *       200:
 *         description: Successfully removed the user.
 *         schema:
 *           type: object
 */
router.delete(
    "/:email",
    asyncHandler(async (req, res) => {
        const result = await userDelete(req.params.email);
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: "Deleted user",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user:
 *   get:
 *     description: Gets all the users from the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all users.
 *         schema:
 *           type: object
 */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const result = await usersGet();
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: "Retrieved all users",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/{email}:
 *   get:
 *     description: Gets a users details from the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's fully qualified email address.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user.
 *         schema:
 *           type: object
 */
router.get(
    "/:email",
    asyncHandler(async (req, res) => {
        const result = await userGet(req.params.email);
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: "Retrieved user",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/{email}/enable:
 *   get:
 *     description: Enables a user by setting a flag in the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's fully qualified email address.
 *     responses:
 *       200:
 *         description: Successfully enabled the user.
 *         schema:
 *           type: object
 */
router.get(
    "/:email/enable",
    asyncHandler(async (req, res) => {
        const result = await userState(req.params.email, "active");
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: "Enabled user",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/{email}/disable:
 *   get:
 *     description: Disables a user by setting a flag in the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's fully qualified email address.
 *     responses:
 *       200:
 *         description: Successfully disabled the user.
 *         schema:
 *           type: object
 */
router.get(
    "/:email/disable",
    asyncHandler(async (req, res) => {
        const result = await userState(req.params.email, "disabled");
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: "User disabled",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user:
 *   post:
 *     description: Adds a user to the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: firstName
 *         type: string
 *         description: First Name
 *         required: true
 *       - in: formData
 *         name: lastName
 *         type: string
 *         description: Last Name
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         description: Email Address
 *         required: true
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
 *         type: number
 *         description: Pin
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully added a user.
 *         schema:
 *           type: object
 */
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await userSet(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: "Added the user.",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user:
 *   put:
 *     description: Adds a user to the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: firstName
 *         type: string
 *         description: First Name
 *         required: false
 *       - in: formData
 *         name: lastName
 *         type: string
 *         description: Last Name
 *         required: false
 *       - in: formData
 *         name: email
 *         type: string
 *         description: Email Address
 *         required: true
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
 *         type: number
 *         description: Pin
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated the user.
 *         schema:
 *           type: object
 */
router.put(
    "/",
    asyncHandler(async (req, res) => {
        const result = await userUpdate(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: "Updated the user",
            data: result,
        });
    })
);

module.exports = router;
