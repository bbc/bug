'use strict';

const express = require('express');
const router = express.Router();
const panelConfigList = require('@services/panelconfig-list');
const panelConfigGet = require('@services/panelconfig-get');
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
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to delete panel" 
        });
    }
});

router.get('/', async function (req, res, next) {
    // Gets a list of configured panels, their configs and states
    try {
        res.json({
            status: "success",
            data: await panelList()
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to list panels" 
        });
    }
});

router.get('/add', async function (req, res, next) {
    try {
        const result = await panelAdd(req.query);
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to add panel" 
        });
    }
});


router.get('/build/:moduleName', async function (req, res, next) {
    try {
        const result = await panelStart(req.params.moduleName);
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to build module" 
        });
    }
});

router.get('/start/:id', async function (req, res, next) {
    // starts and builds if necessary
    try {
        const result = await panelStart(req.params.id);
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to start panel" 
        });
    }
});

router.get('/restart/:id', async function (req, res, next) {
    // stop and start (and rebuild if necessary)
    try {
        const result = await panelRestart(req.params.id);
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to restart panel" 
        });
    }
});

router.get('/stop/:id', async function (req, res, next) {
    // stops the image running (probably won't ever be run from the UI)
    try {
        const result = await panelStop(req.params.id);
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to stop panel" 
        });
    }
});

router.get('/enable/:id', async function (req, res, next) {
    try {
        const result = await panelEnable(req.params.id);
        res.json({
            status: (result ? "success" : "fail"),
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to enable panel" 
        });
    }
});

router.get('/config', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelConfigList()
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to list panel config" 
        });
    }
});


router.get('/config/:id', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelConfigGet(req.params.id)
        });
    } catch (error) {
        res.json({ error: "Failed to fetch panel config" });
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelGet(req.params.id)
        });
    } catch (error) {
        res.json({ error: "Failed to fetch panel" });
    }
});

router.get('/data/:id', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelGetData(req.params.id)
        });
    } catch (error) {
        res.json({ error: "Failed to fetch panel data" });
    }
});

module.exports = router;
