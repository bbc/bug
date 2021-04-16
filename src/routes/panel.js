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
const panelEnable = require('@services/panel-enable');
const panelDisable = require('@services/panel-disable');
const panelPushConfig = require('@services/panel-pushconfig');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

/**
 * @swagger
 * /panel/{panelid}:
 *   delete:
 *     description: Delete a panel from BUG
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully retrieved the panel data.
 *         schema:
 *           type: object
 */
router.delete('/:panelid', async function (req, res, next) {
    try {
        const result = await panelDelete(req.params.panelid);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Deleted panel",
            data: null
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to delete panel" 
        });
    }
});

/**
 * @swagger
 * /panel:
 *   get:
 *     description: Gets a list of configured panels, their configs and states
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of panels.
 *         schema:
 *           type: object
 */
router.get('/', async function (req, res, next) {
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

/**
 * @swagger
 * /panel:
 *   post:
 *     description: Add a panel to BUG
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully retrieved the panel data.
 *         schema:
 *           type: object
 */
router.post('/', async function (req, res, next) {
    try {
        const result = await panelAdd(req.query);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Added panel",
            data: null
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to add panel" 
        });
    }
});

/**
 * @swagger
 * /panel/build/{moduleName}:
 *   get:
 *     description: Build a panel? What's the difference between this and module build?
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully built the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not build the panel.
 *         schema:
 *           type: object
 */
router.get('/build/:moduleName', async function (req, res, next) {
    try {
        const result = await panelStart(req.params.moduleName);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Successfully built module",
            data: null
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to build module" 
        });
    }
});

/**
 * @swagger
 * /panel/start/{panelid}:
 *   get:
 *     description: Start a BUG panel by it's ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully started the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not start the panel.
 *         schema:
 *           type: object
 */
router.get('/start/:panelid', async function (req, res, next) {
    // starts and builds if necessary
    try {
        const result = await panelStart(req.params.panelid);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Started panel",
            data: null
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to start panel" 
        });
    }
});

/**
 * @swagger
 * /panel/restart/{panelid}:
 *   get:
 *     description: Restart a BUG panel by it's ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully restarted the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not restart the panel.
 *         schema:
 *           type: object
 */
router.get('/restart/:panelid', async function (req, res, next) {
    // stop and start (and rebuild if necessary)
    try {
        const result = await panelRestart(req.params.panelid);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Restarted panel",
            data: null
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to restart panel" 
        });
    }
});

/**
 * @swagger
 * /panel/stop/{panelid}:
 *   get:
 *     description: Stop a BUG panel by it's ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully stopped the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not stop the panel.
 *         schema:
 *           type: object
 */
router.get('/stop/:panelid', async function (req, res, next) {
    // stops the image running (probably won't ever be run from the UI)
    try {
        const result = await panelStop(req.params.panelid);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Stopped panel",
            data: null
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to stop panel" 
        });
    }
});

/**
 * @swagger
 * /panel/enable/{panelid}:
 *   get:
 *     description: Enable a BUG panel by it's ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully enabled the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not enable the panel.
 *         schema:
 *           type: object
 */
router.get('/enable/:panelid', async function (req, res, next) {
    try {
        const result = await panelEnable(req.params.panelid);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Enabled panel",
            data: null
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to enable panel" 
        });
    }
});

/**
 * @swagger
 * /panel/disable/{panelid}:
 *   get:
 *     description: Enable a BUG panel by it's ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully disabled the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not disable the panel.
 *         schema:
 *           type: object
 */
router.get('/disable/:panelid', async function (req, res, next) {
    try {
        const result = await panelDisable(req.params.panelid);
        res.json({
            status: (result ? "success" : "fail"),
            message: "Disabled panel",
            data: null
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to disable panel" 
        });
    }
});

/**
 * @swagger
 * /panel/config/{panelid}:
 *   put:
 *     description: Push a config to a BUG panel
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully pushed config to the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not push config to the panel.
 *         schema:
 *           type: object
 */
router.put('/config/:panelid', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelPushConfig(req.params.panelid)
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to push panel config" 
        });
    }
});

/**
 * @swagger
 * /panel/config/all:
 *   get:
 *     description: Get a list of all panel's configs
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved panel config list.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not retieve panel config list.
 *         schema:
 *           type: object
 */
router.get('/config/all', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelConfigList()
        });
    } catch (error) {
        res.status(500);
        res.json({ 
            status: "error",
            message: "Failed to list panel config" 
        });
    }
});

/**
 * @swagger
 * /panel/config/{panelid}:
 *   get:
 *     description: Get the config of a single panel by it's ID.
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully retrieved the panel config.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not retrieved the panel config.
 *         schema:
 *           type: object
 */
router.get('/config/:panelid', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelConfigGet(req.params.panelid)
        });
    } catch (error) {
        res.status(500);
        res.json({ error: "Failed to fetch panel config" });
    }
});

/**
 * @swagger
 * /panel/{panelid}:
 *   get:
 *     description: Get the panel? Not sure what this route is doing.
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully retrieved the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not retrieved the panel.
 *         schema:
 *           type: object
 */
router.get('/:panelid', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelGet(req.params.panelid)
        });
    } catch (error) {
        res.status(500);
        res.json({ error: "Failed to fetch panel" });
    }
});

/**
 * @swagger
 * /panel/data/{panelid}:
 *   get:
 *     description: Get data about a panel by it's ID string
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelid
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully retrieved the panel data.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not get the panel ID data.
 *         schema:
 *           type: object
 */
router.get('/data/:panelid', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await panelGetData(req.params.panelid)
        });
    } catch (error) {
        res.status(500);
        res.json({ error: "Failed to fetch panel data" });
    }
});

module.exports = router;
