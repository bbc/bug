'use strict';

const express = require('express');
const router = express.Router();
const panelConfigList = require('@services/panelconfig-list');
const panelConfigGet = require('@services/panelconfig-get');
const panelGetData = require('@services/panel-getdata');
const panelStart = require('@services/panel-start');
const panelRestart = require('@services/panel-restart');
const panelStop = require('@services/panel-stop');
const panelList = require('@services/panel-list');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

// router.get('/delete', async function (req, res, next) {
// });

// router.get('/add', async function (req, res, next) {
// });

router.get('/start/:panelid', async function (req, res, next) {
    // starts and builds if necessary
    let panelId = req.params.panelid;
    var result = await panelStart(panelId);
    res.json(result);
});

router.get('/restart/:panelid', async function (req, res, next) {
    // stop and start (and rebuild if necessary)
    let panelId = req.params.panelid;
    var result = await panelRestart(panelId);
    res.json(result);
});

router.get('/stop/:panelid', async function (req, res, next) {
    // stops the image running (probably won't ever be run from the UI)
    let panelId = req.params.panelid;
    var result = await panelStop(panelId);
    res.json(result);
});

router.get('/list', async function (req, res, next) {
    // stops the image running (probably won't ever be run from the UI)
    var result = await panelList();
    res.json(result);
});

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
