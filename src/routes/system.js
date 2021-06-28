"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const systemBackup = require("@services/system-backup");
const systemLogs = require("@services/system-logs");
const systemStats = require("@services/system-stats");
const hashResponse = require("@core/hash-response");
const passport = require("passport");

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
router.get(
    "/hello",
    passport.authenticate(["localUser", "pinUser", "localAdmin", "pinAdmin"]),
    function (req, res, next) {
        const message = { data: "Good morning sunshine, the earth says hello." };
        hashResponse(res, req, message);
    }
);

/**
 * @swagger
 * /system/user:
 *    get:
 *      description: Get's the current user - if one's logged in.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/user", function (req, res, next) {
    const response = { data: req.user };
    if (req.user) {
        response.status = "success";
    } else {
        response.status = "failed";
        response.error = "Not signed in";
    }
    hashResponse(res, req, response);
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
router.get(
    "/stats",
    passport.authenticate(["localUser", "pinUser", "localAdmin", "pinAdmin"]),
    async function (req, res, next) {
        const stats = await systemStats();
        hashResponse(res, req, stats);
    }
);

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
router.get(
    "/logs/:level",
    passport.authenticate(["localUser", "pinUser", "localAdmin", "pinAdmin"]),
    async function (req, res, next) {
        const logs = await systemLogs(req.params.level);
        hashResponse(res, req, logs);
    }
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
    passport.authenticate(["localUser", "pinUser", "localAdmin", "pinAdmin"]),
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
    passport.authenticate(["localUser", "pinUser", "localAdmin", "pinAdmin"]),
    function (req, res, next) {
        try {
            if (!req.files) {
                hashResponse(res, req, {
                    status: false,
                    message: "No file uploaded",
                });
            } else {
                const configs = req.files.configs;
                configs.mv("../data/uploads/" + configs.name);

                //send response
                hashResponse(res, req, {
                    status: true,
                    message: "File is uploaded",
                    data: {
                        name: configs.name,
                        mimetype: configs.mimetype,
                        size: configs.size,
                    },
                });
            }
        } catch (err) {
            hashResponse(res, req, { error: err });
        }
    }
);

module.exports = router;
