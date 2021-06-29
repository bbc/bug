"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const restrict = require("@middleware/restrict");
const panelConfigPush = require("@services/panelconfig-push");
const panelConfigSet = require("@services/panelconfig-set");
const panelConfigList = require("@services/panelconfig-list");
const panelConfigGet = require("@services/panelconfig-get");
const hashResponse = require("@core/hash-response");

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

/**
 * @swagger
 * /panelconfig/{panelId}:
 *   put:
 *     description: Update the config of a BUG panel
 *     tags: [panelconfig]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *       - in: body
 *         name: (various)
 *         schema:
 *           type: object
 *         required: true
 *         example:
 *           username: admin
 *           password: password
 *           address: 1.2.3.4
 *         description: Properties to store in the panelconfig
 *     responses:
 *       200:
 *         description: Successfully set the config of the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not set the config of the panel.
 *         schema:
 *           type: object
 */
router.put(
    "/:panelId",
    restrict.to(["admin", "users"]),
    asyncHandler(async (req, res) => {
        const result = await panelConfigSet({
            ...{ id: req.params.panelId },
            ...req.body,
        });
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panelconfig/push/{panelId}:
 *   get:
 *     description: Push a config to a running BUG module container
 *     tags: [panelconfig]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully pushed config to the module.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not push config to the module.
 *         schema:
 *           type: object
 */
router.get(
    "/push/:panelId",
    restrict.to(["admin", "users"]),
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await panelConfigPush(req.params.panelId),
        });
    })
);

/**
 * @swagger
 * /panelconfig/:
 *   get:
 *     description: Returns a list of all panels
 *     tags: [panelconfig]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved panel config list.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not retieve panel config list.
 *         schema:
 *           type: object
 */
router.get(
    "/",
    restrict.to(["admin", "users"]),
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await panelConfigList(),
        });
    })
);

/**
 * @swagger
 * /panelconfig/{panelId}:
 *   get:
 *     description: Returns the config of a single panel
 *     tags: [panelconfig]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully retrieved the panel config.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not retrieved the panel config.
 *         schema:
 *           type: object
 */
router.get(
    "/:panelId",
    restrict.to(["admin", "users"]),
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await panelConfigGet(req.params.panelId),
        });
    })
);

module.exports = router;
