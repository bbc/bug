'use strict';

const express = require('express');
const router = express.Router();
const panelConfigList = require('@services/panelconfig-list');
const panelGet = require('@services/panel-get');
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
    try {
        const result = await panelDelete(req.params.id);
        res.json(result);
    } catch (error) {
        res.json({ error: "Failed to delete panel" });
    }
});

router.get('/', async function (req, res, next) {
    // Gets a list of configured panels, their configs and states
    var result = await panelList();
    res.json(result);
});

router.get('/add', async function (req, res, next) {
    try {
        const result = await panelAdd(req.query);
        res.json(result);
    } catch (error) {
        res.json({ error: "Failed to add panel" });
    }
});


router.get('/build/:moduleName', async function (req, res, next) {
    try {
        const result = await panelStart(req.params.moduleName);
        res.json(result);
    } catch (error) {
        res.json({ error: "Failed to build module" });
    }
});

router.get('/start/:id', async function (req, res, next) {
    // starts and builds if necessary
    try {
        const result = await panelStart(req.params.id);
        res.json(result);
    } catch (error) {
        res.json({ error: "Failed to start panel" });
    }
});

router.get('/restart/:id', async function (req, res, next) {
    // stop and start (and rebuild if necessary)
    try {
        const result = await panelRestart(req.params.id);
        res.json(result);
    } catch (error) {
        res.json({ error: "Failed to restart panel" });
    }
});

router.get('/stop/:id', async function (req, res, next) {
    // stops the image running (probably won't ever be run from the UI)
    try {
        const result = await panelStop(req.params.id);
        res.json(result);
    } catch (error) {
        res.json({ error: "Failed to stop panel" });
    }
});

router.get('/config', async function (req, res, next) {
    try {
        const result = await panelConfigList();
        res.json(result);
    } catch (error) {
        res.json({ error: "Failed to list panel config" });
    }
});

router.get('/:id', async function (req, res, next) {
    const id = req.params.id;
    const result = await panelGet(id);
    res.json(result);
});

router.get('/data/:id', async function (req, res, next) {
    const id = req.params.id;
    const result = await panelGetData(id);
    res.json(result);
});

module.exports = router;
