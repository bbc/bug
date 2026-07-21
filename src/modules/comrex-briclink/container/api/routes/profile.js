const express = require("express");
const router = express.Router();
const profileList = require("@services/profile-list");
const profileLabels = require("@services/profile-labels");
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
    "/rename/:profileId/:profileName",
    asyncHandler(async (req, res) => {
        const result = await profileRename(req.params.profileId, req.params.profileName);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

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
