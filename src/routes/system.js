"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const systemBackup = require("@services/system-backup");
const systemRestore = require("@services/system-restore");
const systemLogs = require("@services/system-logs");
const systemLogsPaginated = require("@services/system-logs-paginated");
const systemContainers = require("@services/system-containers");
const systemStats = require("@services/system-stats");
const hashResponse = require("@core/hash-response");
const restrict = require("@middleware/restrict");
const systemInfo = require("@services/system-info");
const systemUpdate = require("@services/system-update-apply");
const systemUpdateCache = require("@services/system-update-cache");
const systemSettingsGet = require("@services/system-settings-get");
const systemSettingsUpdate = require("@services/system-settings-update");

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
router.get("/hello", restrict.to(["admin", "user"]), function (req, res, next) {
    const message = { data: "Good morning sunshine, the earth says hello." };
    hashResponse(res, req, message);
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
 * /system/stats:
 *   get:
 *     description: Returns the underlying system statistics
 *     tags: [system]
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/stats", restrict.to(["admin", "user"]), async function (req, res, next) {
    const stats = await systemStats();
    hashResponse(res, req, stats);
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
 * /system/update:
 *   get:
 *     description: Applies any downloaded system updates
 *     tags: [system]
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/update", async function (req, res, next) {
    const result = await systemUpdate();
    console.log(result);
    hashResponse(res, req, {
        ...result,
        status: result.error ? "failure" : "success",
    });
});

/**
 * @swagger
 * /system/updatecheck:
 *   get:
 *     description: Check for BUG updates
 *     tags: [system]
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/updatecheck", async function (req, res, next) {
    const result = await systemUpdateCache();
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
 * /system/logs:
 *   post:
 *     description: Returns the system logs according to specifed filters
 *     tags: [system]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: sortField
 *         type: string
 *         required: false
 *         description: The field to sort results by
 *       - in: formData
 *         name: sortDirection
 *         type: string
 *         required: false
 *         description: The direction to sort by - either "asc" or "desc"
 *       - in: formData
 *         name: filters
 *         type: object
 *         required: false
 *         description: An object containing key/value pairs to filter results by
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
    "/logs",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await systemLogs(req.body.sortField, req.body.sortDirection, req.body.filters),
        });
    })
);

/**
 * @swagger
 * /system/logs/{page}:
 *   post:
 *     description: Returns the logs in a paginated form
 *     tags: [system]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: page
 *         type: integer
 *         required: true
 *         description: The page number to return
 *       - in: formData
 *         name: nPerPage
 *         type: integer
 *         required: true
 *         description: The number of results to return per page
 *       - in: formData
 *         name: sortField
 *         type: string
 *         required: false
 *         description: The field to sort results by
 *       - in: formData
 *         name: sortDirection
 *         type: string
 *         required: false
 *         description: The direction to sort by - either "asc" or "desc"
 *       - in: formData
 *         name: filters
 *         type: object
 *         required: false
 *         description: An object containing key/value pairs to filter results by
 *     responses:
 *       '200':
 *         description: Success
 */
router.post(
    "/logs/:page",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await systemLogsPaginated(
                req.body.sortField,
                req.body.sortDirection,
                req.body.filters,
                req.params.page,
                req.body.nPerPage
            ),
        });
    })
);

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
