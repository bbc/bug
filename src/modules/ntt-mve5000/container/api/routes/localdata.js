const express = require("express");
const router = express.Router();
const localdataSet = require("@services/localdata-set");
const asyncHandler = require("express-async-handler");

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await localdataSet(req.body);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
