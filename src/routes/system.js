'use strict';

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const systemBackup = require('@services/system-backup');
// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/hello', function (req, res, next) {
    res.json("Hello");
    logger.info("HELLO");
});

router.get('/backup', async function (req, res, next) {
    const result = await systemBackup();
    try {
        res.download(result.filepath,result.filename);
    } catch (error) {
        res.json({ error: "Failed to run system backup" });
    }
});

router.get('/restore', function (req, res, next) {
    res.json("Hello");
});

module.exports = router;
