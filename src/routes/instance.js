'use strict';

const express = require('express');
const router = express.Router();
const instanceConfigList = require('@services/instance-configlist');
const instanceGetConfig = require('@services/instance-getconfig');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/config', async function (req, res, next) {
    var result = await instanceConfigList();
    res.json(result);
});

router.get('/config/:instanceid', async function (req, res, next) {
    let instanceId = req.params.instanceid;
    var result = await instanceGetConfig(instanceId);
    res.json(result);
});

module.exports = router;
