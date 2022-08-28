const express = require("express");
const router = express.Router();
const profileList = require("@services/profile-list");
const profileLabels = require("@services/profile-labels");
const profileGet = require("@services/profile-get");
const profileRename = require("@services/profile-rename");
const profileSetDefault = require("@services/profile-setdefault");
const asyncHandler = require("express-async-handler");

router.get(
    "/labels",
    asyncHandler(async (req, res) => {
        const result = await profileLabels();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/:profileId",
    asyncHandler(async (req, res) => {
        const result = await profileGet(req.params.profileId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get("/rename/:profileId/:profileName", async function (req, res, next) {
    try {
        const result = await profileRename(req.params.profileId, req.params.profileName);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename profile",
        });
    }
});

router.get(
    "/setdefault/:profileId",
    asyncHandler(async (req, res) => {
        const result = await profileSetDefault(req.params.profileId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.all(
    "/",
    asyncHandler(async (req, res) => {
        const result = await profileList();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
