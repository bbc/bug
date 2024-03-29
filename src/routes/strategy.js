"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const restrict = require("@middleware/restrict");
const strategyUpdate = require("@services/strategy-update");
const strategyList = require("@services/strategy-list");
const strategyListSafe = require("@services/strategy-listsafe");
const strategyReorder = require("@services/strategy-reorder");
const strategyGet = require("@services/strategy-get");
const strategyGetSafe = require("@services/strategy-getsafe");
const strategyState = require("@services/strategy-state");

/**
 * @swagger
 * /strategy:
 *   get:
 *     description: Gets all the security strategies for BUG
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all strategies.
 *         schema:
 *           type: object
 */
router.get(
    "/",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const result = await strategyList();
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully retrieved all strategies` : "Failed to retreive strategy list",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/safe:
 *   get:
 *     description: Gets all the security strategies for BUG, sanitised for non-authenticated users
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all strategies.
 *         schema:
 *           type: object
 */
router.get(
    "/safe/",
    asyncHandler(async (req, res) => {
        const result = await strategyListSafe();
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully retrieved all strategies` : "Failed to retreive strategy list",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/reorder:
 *   post:
 *     description: Sets the order of stragies to the specified array
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: strategies
 *         type: array
 *         description: List of strategy types - in order
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully updated strategy order
 *         schema:
 *           type: object
 */
router.post(
    "/reorder",
    asyncHandler(async (req, res) => {
        const result = await strategyReorder(req?.body?.strategies);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully updated strategy order` : "Failed to update strategy order",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{type}:
 *   get:
 *     description: Gets a strategy's details from BUG
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         type: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The security strategies' type. One of [local,pin,saml,proxy]
 *     responses:
 *       200:
 *         description: Successfully retrieved the strategy.
 *         schema:
 *           type: object
 */
router.get(
    "/:type",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const result = await strategyGet(req.params.type);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully got strategy called ${req.params.type}` : "Failed to retreive strategy",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/safe/{type}:
 *   get:
 *     description: Gets a strategy's details from BUG, sanitised for non-authenticated users
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         type: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The security strategies' type. One of [local,pin,saml,proxy,auto]
 *     responses:
 *       200:
 *         description: Successfully retrieved the strategy.
 *         schema:
 *           type: object
 */
router.get(
    "/safe/:type",
    asyncHandler(async (req, res) => {
        const result = await strategyGetSafe(req.params.type);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully got strategy called ${req.params.type}` : "Failed to retreive strategy",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{type}/enable:
 *   get:
 *     description: Enables a strategy by setting a flag in BUG
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         type: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The strategies type. One of [local,pin,saml,proxy]
 *     responses:
 *       200:
 *         description: Successfully enabled the strategy.
 *         schema:
 *           type: object
 */
router.get(
    "/:type/enable",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const result = await strategyState(req.params.type, true);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully enabled strategy type ${req.params.type}` : "Failed to enable strategy",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{type}/disable:
 *   get:
 *     description: Disables a strategy by setting a flag in the strategy file
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         type: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The strategies type. One of [local,pin,saml,proxy]
 *     responses:
 *       200:
 *         description: Successfully disabled the strategy.
 *         schema:
 *           type: object
 */
router.get(
    "/:type/disable",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const result = await strategyState(req.params.type, false);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully disabled strategy type ${req.params.type}` : "Failed to disable strategy",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{type}:
 *   put:
 *     description: Adds a strategy to the BUG database
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         type: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The strategies type. One of [local,pin,saml,proxy]
 *       - in: formData
 *         name: settings
 *         type: object
 *         description: Strategy settings
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated the strategy.
 *         schema:
 *           type: object
 */
router.put(
    "/:type",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const result = await strategyUpdate(req.params.type, req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? `Succesfully updated ${req.params.name} settings` : "Failed to update settings",
            data: result,
        });
    })
);

module.exports = router;
