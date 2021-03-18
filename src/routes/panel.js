'use strict';

const express = require('express');
const router = express.Router();
const panelConfigList = require('@services/panelconfig-list');
const panelConfigGet = require('@services/panelconfig-get');
const panelGetData = require('@services/panel-getdata');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/config', async function (req, res, next) {
    var result = await panelConfigList();
    res.json(result);
});

router.get('/config/:panelid', async function (req, res, next) {
    let panelId = req.params.panelid;
    var result = await panelConfigGet(panelId);
    res.json(result);
});

router.get('/data/:panelid', async function (req, res, next) {
    let panelId = req.params.panelid;
    var result = await panelGetData(panelId);
    res.json(result);
});

module.exports = router;
