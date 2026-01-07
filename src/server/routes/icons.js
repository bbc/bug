"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const iconsGet = require("@services/icons-get");
const hashResponse = require("@core/hash-response");
const iconsSettings = require("@services/icons-settings");
const restrict = require("@middleware/restrict");

/**
 * @swagger
 * /icons/variants:
 *   get:
 *     description: Returns a list of available variants for the icons
 *     tags: [icon]
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
    "/variants",
    restrict.to(["admin", "user"]),
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
 *     tags: [icon]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: iconName
 *         schema:
 *           type: string
 *         required: false
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

/**
 * @swagger
 * /icons/{iconName}:
 *   post:
 *     description: Returns a list of available icons matching the supplied icon name and variant
 *     tags: [icon]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: iconName
 *         schema:
 *           type: string
 *         required: true
 *         description: The icon name
 *       - in: formData
 *         name: length
 *         type: integar
 *         description: length of something
 *         required: true
 *       - in: formData
 *         name: variant
 *         type: string
 *         description: Icon variant options include mdi, fa and mui.
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
