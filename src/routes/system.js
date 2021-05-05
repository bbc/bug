"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const logger = require("@utils/logger")(module);
const systemBackup = require("@services/system-backup");
const systemLogs = require("@services/system-logs");
// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

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
    const message = "Good morning sunshine, the earth says hello.";
    res.json(message);
    logger.info(message);
});

/**
 * @swagger
 * /system/logs:
 *    get:
 *      description: Test route, BUG greets you in response.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
 router.get("/logs/:level", function (req, res, next) {
    const logs = systemLogs(req.params.level);
    res.json(logs);
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
    asyncHandler(async (req, res) => {
        const result = await systemBackup();
        res.download(result.filepath, result.filename);
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
router.get("/restore", function (req, res, next) {
    res.json("Hello");
});

module.exports = router;
