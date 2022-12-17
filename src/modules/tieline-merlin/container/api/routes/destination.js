const express = require("express");
const router = express.Router();
const destinationUpdate = require("@services/destination-update");
const asyncHandler = require("express-async-handler");

router.put(
    "/:programHandle/:groupId/:connectionId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await destinationUpdate(
                req.params.programHandle,
                req.params.groupId,
                req.params.connectionId,
                req.body
            ),
        });
    })
);

module.exports = router;
