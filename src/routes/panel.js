'use strict';

const express = require('express');
const router = express.Router();
const panelConfigList = require('@services/panelconfig-list');
const panelConfigGet = require('@services/panelconfig-get');
const panelGetData = require('@services/panel-getdata');
const panelStart = require('@services/panel-start');
const panelRestart = require('@services/panel-restart');
const panelStop = require('@services/panel-stop');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

// router.get('/delete', async function (req, res, next) {
// });

// router.get('/add', async function (req, res, next) {
// });

router.get('/start', async function (req, res, next) {
    // starts and builds if necessary
    var result = await panelStart();
    res.json(result);
});

router.get('/restart', async function (req, res, next) {
    // stop and start (and rebuild if necessary)
    var result = await panelRestart();
    res.json(result);
});

router.get('/stop', async function (req, res, next) {
    // stops the image running (probably won't ever be run from the UI)
    var result = await panelStop();
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
