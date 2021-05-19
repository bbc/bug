"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const systemBackup = require("@services/system-backup");
const systemLogs = require("@services/system-logs");
const hashResponse = require("@utils/hash-response");

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
    const message = {data:"Good morning sunshine, the earth says hello."};
    hashResponse(res,req,message);
});

/**
 * @swagger
 * /system/logs/{level}:
 *   get:
 *     description: Returns the logs of a particular level
 *     tags: [system]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: level
 *         schema:
 *           type: string
 *         required: true
 *         description: The log level to return, options includ (info,http,action,warning,error)
 *     responses:
 *       '200':
 *         description: Success
 */
router.get("/logs/:level", async function (req, res, next) {
    const logs = await systemLogs(req.params.level);
    hashResponse(res,req,logs);
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
        const backup = await systemBackup();
        res.header('Content-Disposition',`attachment; filename="${backup.filename}"`);
        backup.stream.pipe(res)
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
    hashResponse(res,req,"Hello");
});

module.exports = router;
