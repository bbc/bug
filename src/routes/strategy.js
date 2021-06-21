"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const strategyUpdate = require("@services/strategy-update");
const strategyList = require("@services/strategy-list");
const strategyGet = require("@services/strategy-get");
const strategyState = require("@services/strategy-state");

/**
 * @swagger
 * /strategy:
 *   get:
 *     description: Gets all the strategys from the BUG
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all strategys.
 *         schema:
 *           type: object
 */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const result = await strategyList();
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: result
                ? `Succesfully retrieved all strategies`
                : "Failed to retreive strategy list",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{name}:
 *   get:
 *     description: Gets a strategys details from BUG
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The strategies name. One of [local,pin,saml,proxy]
 *     responses:
 *       200:
 *         description: Successfully retrieved the strategy.
 *         schema:
 *           type: object
 */
router.get(
    "/:name",
    asyncHandler(async (req, res) => {
        const result = await strategyGet(req.params.name);
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: result
                ? `Succesfully got strategy called ${req.params.name}`
                : "Failed to retreive strategy",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{name}/enable:
 *   get:
 *     description: Enables a strategy by setting a flag in BUG
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The strategies name. One of [local,pin,saml,proxy]
 *     responses:
 *       200:
 *         description: Successfully enabled the strategy.
 *         schema:
 *           type: object
 */
router.get(
    "/:name/enable",
    asyncHandler(async (req, res) => {
        const result = await strategyState(req.params.name, "active");
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: result
                ? `Succesfully enabled strategy called ${req.params.name}`
                : "Failed to enable strategy",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{name}/disable:
 *   get:
 *     description: Disables a strategy by setting a flag in the strategy file
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The strategies name. One of [local,pin,saml,proxy]
 *     responses:
 *       200:
 *         description: Successfully disabled the strategy.
 *         schema:
 *           type: object
 */
router.get(
    "/:name/disable",
    asyncHandler(async (req, res) => {
        const result = await strategyState(req.params.name, "disabled");
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: result
                ? `Succesfully disabled strategy called ${req.params.name}`
                : "Failed to disable strategy",
            data: result,
        });
    })
);

/**
 * @swagger
 * /strategy/{name}:
 *   put:
 *     description: Adds a strategy to the BUG database
 *     tags: [strategy]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The strategies name. One of [local,pin,saml,proxy]
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
    "/:name",
    asyncHandler(async (req, res) => {
        const result = await strategyUpdate({
            name: req.params.name,
            settings: req.body,
        });
        hashResponse(res, req, {
            status: result ? "success" : "fail",
            message: result
                ? `Succesfully updated ${req.params.name} settings`
                : "Failed to update settings",
            data: result,
        });
    })
);

module.exports = router;
