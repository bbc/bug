'use strict';

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const systemBackup = require('@services/system-backup');
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
router.get('/hello', function (req, res, next) {
    const message = 'Good morning sunshine, the earth says hello.';
    res.json(message);
    logger.info(message);
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
router.get('/backup', async function (req, res, next) {
    const result = await systemBackup();
    try {
        res.download(result.filepath,result.filename);
    } catch (error) {
        res.json({ error: "Failed to run system backup" });
    }
});

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
router.get('/restore', function (req, res, next) {
    res.json("Hello");
});

module.exports = router;
