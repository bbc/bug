"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const panelGet = require("@services/panel-get");
const panelGetData = require("@services/panel-getdata");
const panelStart = require("@services/panel-start");
const panelRestart = require("@services/panel-restart");
const panelStop = require("@services/panel-stop");
const panelList = require("@services/panel-list");
const panelAdd = require("@services/panel-add");
const panelDelete = require("@services/panel-delete");
const panelEnable = require("@services/panel-enable");
const panelDisable = require("@services/panel-disable");
const panelConfigPush = require("@services/panel-configpush");
const panelConfigSet = require("@services/panel-configset");
const panelConfigList = require("@services/panel-configlist");
const panelConfigGet = require("@services/panel-configget");

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

/**
 * @swagger
 * /panel/{panelId}:
 *   delete:
 *     description: Delete a panel from BUG
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.delete(
    "/:panelId",
    asyncHandler(async (req, res) => {
        const result = await panelDelete(req.params.panelId);
        res.json({
            status: result ? "success" : "fail",
            message: "Deleted panel",
            data: null,
        });
    })
);

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
router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await panelList(),
        });
    })
);

/**
 * @swagger
 * /panel:
 *   post:
 *     description: Add a panel to BUG
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: module
 *         type: string
 *         description: Module Name
 *         required: true
 *       - in: formData
 *         name: id
 *         type: string
 *         description: Panel ID, if not set is generated automatically, however it can be set manually here.
 *       - in: formData
 *         name: title
 *         type: string
 *         description: Panel Title
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         description: Panel Description
 *     responses:
 *       200:
 *         description: Successfully retrieved the panel data.
 *         schema:
 *           type: object
 */
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await panelAdd(req.body);
        res.json({
            status: result ? "success" : "fail",
            message: "Added panel",
            data: null,
        });
    })
);

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
 *         name: panelId
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
router.get(
    "/build/:moduleName",
    asyncHandler(async (req, res) => {
        const result = await panelStart(req.params.moduleName);
        res.json({
            status: result ? "success" : "fail",
            message: "Successfully built module",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panel/start/{panelId}:
 *   get:
 *     description: Start a BUG panel by its ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/start/:panelId",
    asyncHandler(async (req, res) => {
        // starts and builds if necessary
        const result = await panelStart(req.params.panelId);
        res.json({
            status: result ? "success" : "fail",
            message: "Started panel",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panel/restart/{panelId}:
 *   get:
 *     description: Restart a BUG panel by its ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/restart/:panelId",
    asyncHandler(async (req, res) => {
        // stop and start (and rebuild if necessary)
        const result = await panelRestart(req.params.panelId);
        res.json({
            status: result ? "success" : "fail",
            message: "Restarted panel",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panel/stop/{panelId}:
 *   get:
 *     description: Stop a BUG panel by its ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/stop/:panelId",
    asyncHandler(async (req, res) => {
        // stops the image running (probably won't ever be run from the UI)
        const result = await panelStop(req.params.panelId);
        res.json({
            status: result ? "success" : "fail",
            message: "Stopped panel",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panel/enable/{panelId}:
 *   get:
 *     description: Enable a BUG panel by its ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/enable/:panelId",
    asyncHandler(async (req, res) => {
        const result = await panelEnable(req.params.panelId);
        res.json({
            status: result ? "success" : "fail",
            message: "Enabled panel",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panel/disable/{panelId}:
 *   get:
 *     description: Enable a BUG panel by its ID
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/disable/:panelId",
    asyncHandler(async (req, res) => {
        const result = await panelDisable(req.params.panelId);
        res.json({
            status: result ? "success" : "fail",
            message: "Disabled panel",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panel/config/{panelId}:
 *   put:
 *     description: Update the config of a BUG panel
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully set the config of the panel.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not set the config of the panel.
 *         schema:
 *           type: object
 */
router.put(
    "/config/:panelId",
    asyncHandler(async (req, res) => {
        const result = await panelConfigSet({ ...{ id: req.params.panelId }, ...req.body });
        res.json({
            status: result ? "success" : "fail",
            data: null,
        });
    })
);

/**
 * @swagger
 * /panel/config/push/{panelId}:
 *   get:
 *     description: Push a config to a running BUG module container
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The panel ID string
 *     responses:
 *       200:
 *         description: Successfully pushed config to the module.
 *         schema:
 *           type: object
 *       500:
 *         description: Error, could not push config to the module.
 *         schema:
 *           type: object
 */
router.get(
    "/config/push/:panelId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await panelConfigPush(req.params.panelId),
        });
    })
);

/**
 * @swagger
 * /panel/config/all:
 *   get:
 *     description: Returns a list of all panels
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
router.get(
    "/config/all",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await panelConfigList(),
        });
    })
);

/**
 * @swagger
 * /panel/config/{panelId}:
 *   get:
 *     description: Returns the config of a single panel
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/config/:panelId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await panelConfigGet(req.params.panelId),
        });
    })
);

/**
 * @swagger
 * /panel/{panelId}:
 *   get:
 *     description: Fetches information about a single panel
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/:panelId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await panelGet(req.params.panelId),
        });
    })
);

/**
 * @swagger
 * /panel/data/{panelId}:
 *   get:
 *     description: Get data about a panel by its ID string
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: panelId
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
router.get(
    "/data/:panelId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await panelGetData(req.params.panelId),
        });
    })
);

module.exports = router;
