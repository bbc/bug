const express = require("express");
const router = express.Router();
const vmList = require("@services/vm-list");
const vmDelete = require("@services/vm-delete");
const vmStart = require("@services/vm-start");
const vmRename = require("@services/vm-rename");
const vmSetDescription = require("@services/vm-setdescription");
const vmCleanShutdown = require("@services/vm-cleanshutdown");
const vmCleanReboot = require("@services/vm-cleanreboot");
const vmHardShutdown = require("@services/vm-hardshutdown");
const vmHardReboot = require("@services/vm-hardreboot");
const vmEnableAutoPower = require("@services/vm-enableautopower");
const vmDisableAutoPower = require("@services/vm-disableautopower");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get VM list",
        });
    }
});

router.delete("/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmDelete(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete VM",
        });
    }
});

router.get("/start/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmStart(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to start VM",
        });
    }
});

router.get("/cleanshutdown/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmCleanShutdown(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to stop VM",
        });
    }
});

router.get("/hardshutdown/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmHardShutdown(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to stop VM",
        });
    }
});

router.get("/cleanreboot/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmCleanReboot(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to reboot VM",
        });
    }
});

router.get("/hardreboot/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmHardReboot(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to reboot VM",
        });
    }
});

router.get("/enableautopower/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmEnableAutoPower(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to enable VM autopower setting",
        });
    }
});

router.get("/disableautopower/:uuid", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmDisableAutoPower(req.params.uuid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to disable VM autopower setting",
        });
    }
});

router.get("/rename/:uuid/:newName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmRename(req.params.uuid, req.params.newName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename VM",
        });
    }
});

router.get("/setdescription/:uuid/:newDescription", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await vmSetDescription(req.params.uuid, req.params.newDescription),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set VM description",
        });
    }
});

module.exports = router;
