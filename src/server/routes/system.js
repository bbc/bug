"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const systemBackup = require("@services/system-backup");
const systemRestore = require("@services/system-restore");
const systemContainers = require("@services/system-containers");
const systemInfo = require("@services/system-info");
const hashResponse = require("@core/hash-response");
const restrict = require("@middleware/restrict");
const systemHostHealth = require("@services/system-hosthealth");
const systemContainerHealth = require("@services/system-containerhealth");
const systemSettingsGet = require("@services/system-settings-get");
const systemSettingsUpdate = require("@services/system-settings-update");
const dockerCleanup = require("@services/docker-cleanup");

/**
 * @swagger
 * /system/hello:
 *    get:
 *      description: Test route, BUG greets you in response.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/hello", function (req, res, next) {
    const message = { data: "Good morning sunshine, the earth says hello.", status: "success" };
    hashResponse(res, req, message);
});

/**
 * @swagger
 * /system/cleanup:
 *    get:
 *      description: Cleans up unused images, containers volumes and other system junk.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/cleanup", restrict.to(["admin", "user"]), async function (req, res, next) {
    const data = await dockerCleanup();
    hashResponse(res, req, {
        status: data ? "success" : "failure",
        data: data,
    });
});

/**
 * @swagger
 * /system/containers:
 *    get:
 *      description: Get a list of running containers.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/containers", restrict.to(["admin", "user"]), async function (req, res, next) {
    const containers = await systemContainers();
    hashResponse(res, req, containers);
});

/**
 * @swagger
 * /system/hosthealth:
 *   get:
 *     description: Returns host health metrics
 *     tags: [system]
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/hosthealth", restrict.to(["admin", "user"]), async function (req, res, next) {
    hashResponse(res, req, await systemHostHealth());
});

/**
 * @swagger
 * /system/containerhealth:
 *   post:
 *     description: Returns container health metrics
 *     tags: [system]
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 */
router.all("/containerhealth", restrict.to(["admin", "user"]), async function (req, res, next) {
    hashResponse(res, req, await systemContainerHealth(req.body.sortField, req.body.sortDirection, req.body.filters));
});

/**
 * @swagger
 * /system/info:
 *   get:
 *     description: Returns the global system information
 *     tags: [system]
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/info", async function (req, res, next) {
    const result = await systemInfo();
    hashResponse(res, req, {
        status: result ? "success" : "failure",
        data: result?.data,
    });
});

/**
 * @swagger
 * /system/settings:
 *   get:
 *     description: Returns the global settings
 *     tags: [system]
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/settings", async function (req, res, next) {
    const result = await systemSettingsGet();
    hashResponse(res, req, {
        status: result ? "success" : "failure",
        data: result?.data,
    });
});

/**
 * @swagger
 * /system/settings:
 *   put:
 *     tags: [system]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: (various)
 *         schema:
 *           type: object
 *         required: true
 *         example:
 *           title: Your very own BUG
 *           description: Some details about your BUG instance
 *           theme: dark
 *         description: Object with global BUG settings
 *     responses:
 *       200:
 *         description: Successfully set the settings for BUG.
 *         schema:
 *           type: object
 */
router.put("/settings", restrict.to(["admin", "user"]), async function (req, res, next) {
    const result = await systemSettingsUpdate(req.body);
    hashResponse(res, req, {
        status: result ? "success" : "failure",
        data: result?.data,
    });
});

/**
 * @swagger
 * /system/backup:
 *    get:
 *      description: Get a gziped tarball of the current panel configs.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get(
    "/backup",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const backup = await systemBackup();
        res.header("Content-Disposition", `attachment; filename="${backup.filename}"`);
        backup.stream.pipe(res);
    })
);

/**
 * @swagger
 * /system/restore:
 *    get:
 *      description: Upload a BUG backup file to move configs between BUG panels
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/restore",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        let result = {};
        if (!req.files || !req.files.backup) {
            result = { status: "failure", message: "No files uploaded" };
        } else {
            result = await systemRestore(req.files.backup);
        }
        hashResponse(res, req, result);
    })
);

module.exports = router;
