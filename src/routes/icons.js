"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const iconsGet = require("@services/icons-get");
const hashResponse = require("@core/hash-response");
const iconsSettings = require("@services/icons-settings");

/**
 * @swagger
 * /icons/{iconName}:
 *   get:
 *     description: Returns a list of available variants for the icons
 *     tags: [module]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved the variant list
 *         schema:
 *           type: object
 *       500:
 *         description: Error getting the variant list
 *         schema:
 *           type: object
 */
router.get(
    "/variants/",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: iconsSettings.variants,
        });
    })
);

/**
 * @swagger
 * /icons/{iconName}:
 *   get:
 *     description: Returns a list of available icons matching the supplied icon name
 *     tags: [module]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: iconName
 *         schema:
 *           type: string
 *         required: true
 *         description: The icon name
 *     responses:
 *       200:
 *         description: Successfully retrieved the icon list
 *         schema:
 *           type: object
 *       500:
 *         description: Error getting the icon list
 *         schema:
 *           type: object
 */
router.get(
    "/:iconName?",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await iconsGet(req.params.iconName),
        });
    })
);

//TODO - no idea how to do this documentation for a POST
/**
 * @swagger
 * /icons/{iconName}:
 *   post:
 *     description: Returns a list of available icons matching the supplied icon name and variant
 *     tags: [module]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: iconName
 *         schema:
 *           type: string
 *         required: true
 *         description: The icon name
 *     responses:
 *       200:
 *         description: Successfully retrieved the icon list
 *         schema:
 *           type: object
 *       500:
 *         description: Error getting the icon list
 *         schema:
 *           type: object
 */
router.post(
    "/:iconName?",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await iconsGet(req.params.iconName, req.body.variant, req.body.length),
        });
    })
);
module.exports = router;
