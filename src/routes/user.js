"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const restrict = require("@middleware/restrict");
const userDelete = require("@services/user-delete");
const userSet = require("@services/user-set");
const userUpdate = require("@services/user-update");
const userList = require("@services/user-list");
const userGet = require("@services/user-get");
const userEnable = require("@services/user-enable");

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     description: Deletes a user from BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's unique UUID (can be retrieved from the user list).
 *     responses:
 *       200:
 *         description: Successfully removed the user.
 *         schema:
 *           type: object
 */
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const result = await userDelete(req.params.id);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Deleted the user.` : "Failed to delete the user by the given UUID.",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/current:
 *    get:
 *      description: Gets the current user - if one's logged in.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get(
    "/current",
    asyncHandler(async (req, res) => {
        const result = await userGet(req?.user);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Retrieved the current user.` : "There is no current user.",
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
        const result = await userList(true);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Retrieved all users.` : "Failed to a list of users.",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     description: Gets a users details from the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's unique id.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user.
 *         schema:
 *           type: object
 */
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const result = await userGet(req.params.id);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Retrieved the user.` : "Failed to retrive a user by the given UUID.",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/{id}/enable:
 *   get:
 *     description: Enables a user by setting a flag in the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's unique UUID.
 *     responses:
 *       200:
 *         description: Successfully enabled the user.
 *         schema:
 *           type: object
 */
router.get(
    "/:id/enable",
    asyncHandler(async (req, res) => {
        const result = await userEnable(req.params.id, true);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Enabled the user.` : "Failed to enable the user.",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/{id}/disable:
 *   get:
 *     description: Disables a user by setting a flag in the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's unique UUID.
 *     responses:
 *       200:
 *         description: Successfully disabled the user.
 *         schema:
 *           type: object
 */
router.get(
    "/:id/disable",
    asyncHandler(async (req, res) => {
        const result = await userEnable(req.params.id, false);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Disabled the user.` : "Failed to disable the user.",
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
            status: result ? "success" : "failure",
            message: result ? `Succesfully added the user.` : "Failed to add the user.",
            data: result,
        });
    })
);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     description: Adds a user to the BUG database
 *     tags: [user]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's unique UUID.
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
    "/:id",
    asyncHandler(async (req, res) => {
        const result = await userUpdate(req.params.id, req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully updated the user.` : "Failed to update the user.",
            data: result,
        });
    })
);

module.exports = router;
