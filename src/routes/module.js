"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const moduleList = require("@services/module-list");
const moduleGet = require("@services/module-get");
const moduleBuild = require("@services/module-build");
const moduleRebuild = require("@services/module-rebuild");

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

/**
 * @swagger
 * /module:
 *   get:
 *     description: Returns a list of modules avalible to be added as panels.
 *     tags: [module]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrievd the module list
 *         schema:
 *           type: object
 *       500:
 *         description: Error getting module list
 *         schema:
 *           type: object
 */
router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await moduleList(),
        });
    })
);

/**
 * @swagger
 * /module/{modulename}:
 *   get:
 *     description: Gets the modules information about a specifc module by its name.
 *     tags: [module]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: modulename
 *         schema:
 *           type: string
 *         required: true
 *         description: The module name
 *     responses:
 *       200:
 *         description: Successfully retrievd the module info
 *         schema:
 *           type: object
 *       500:
 *         description: Error get the module information
 *         schema:
 *           type: object
 */
router.get(
    "/:modulename",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await moduleGet(req.params.modulename),
        });
    })
);

/**
 * @swagger
 * /module/build/{modulename}:
 *   get:
 *     description: Builds the Docker image of a module by its name
 *     tags: [module]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: modulename
 *         schema:
 *           type: string
 *         required: true
 *         description: The module name
 *     responses:
 *       200:
 *         description: Successfully built the module
 *         schema:
 *           type: object
 *       500:
 *         description: Error building the image
 *         schema:
 *           type: object
 */
router.get(
    "/build/:modulename",
    asyncHandler(async (req, res) => {
        const result = await moduleBuild(req.params.modulename);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

/**
 * @swagger
 * /rebuild/:MODULE_NAME:
 *   get:
 *     description: Rebuilds the Docker image of a module by name - not for use in application - for dev/testing purposes only
 *     tags: [module]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: modulename
 *         schema:
 *           type: string
 *         required: true
 *         description: The module name
 *     responses:
 *       200:
 *         description: Successfully rebuilt the module
 *         schema:
 *           type: object
 *       500:
 *         description: Error rebuilding the image
 *         schema:
 *           type: object
 */
router.get(
    "/rebuild/:modulename",
    asyncHandler(async (req, res) => {
        const result = await moduleRebuild(req.params.modulename);
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

module.exports = router;
