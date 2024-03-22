const express = require("express");
const router = express.Router();
const moduleList = require("@services/module-list");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await moduleList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get module list",
        });
    }
});

module.exports = router;
