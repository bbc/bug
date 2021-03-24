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
const panelAdd = require('@services/panel-add');
const panelDelete = require('@services/panel-delete');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/delete/:id', async function (req, res, next) {
    // starts and builds if necessary
    const id = req.params.id;
    const result = await panelDelete(id);
});

router.get('/', async function (req, res, next) {
    // Gets a list of configured panels, their configs and states
    var result = await panelList();
    res.json(result);
});

router.get('/add', async function (req, res, next) {
    // Gets a list of configured panels, their configs and states
    const config = req.query
    const result = await panelAdd(config);
    res.json(result);
});


router.get('/build/:moduleName', async function (req, res, next) {
    // starts and builds if necessary
    const moduleName = req.params.moduleName;
    const result = await panelStart(moduleName);
    res.json(result);
});

router.get('/start/:id', async function (req, res, next) {
    // starts and builds if necessary
    const id = req.params.id;
    const result = await panelStart(id);
    res.json(result);
});

router.get('/restart/:id', async function (req, res, next) {
    // stop and start (and rebuild if necessary)
    const id = req.params.id;
    const result = await panelRestart(id);
    res.json(result);
});

router.get('/stop/:id', async function (req, res, next) {
    // stops the image running (probably won't ever be run from the UI)
    const id = req.params.id;
    const result = await panelStop(id);
    res.json(result);
});

router.get('/config', async function (req, res, next) {
    const result = await panelConfigList();
    res.json(result);
});

router.get('/config/:id', async function (req, res, next) {
    const id = req.params.id;
    const result = await panelConfigGet(id);
    res.json(result);
});

router.get('/data/:id', async function (req, res, next) {
    const id = req.params.id;
    const result = await panelGetData(id);
    res.json(result);
});

module.exports = router;
