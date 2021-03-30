'use strict';

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const moduleList = require('@services/module-list');
const moduleGet = require('@services/module-get');
const moduleBuild = require('@services/module-build')

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await moduleList()
        });
    } catch (error) {
        res.json({ error: "Failed to fetch module list" });
    }
});

router.get('/:modulename', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await moduleGet(req.params.modulename)
        });
    } catch (error) {
        res.json({ error: "Failed to fetch module" });
    }
});

router.get('/build/:modulename', async function (req, res, next) {
    const result = await moduleBuild(req.params.modulename);
    try {
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ error: "Failed to build module" });
    }
});
  
module.exports = router;
