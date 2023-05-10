const express = require("express");
const router = express.Router();
const thumbGet = require("@services/thumb-get");

router.get("/:board/:slot", async function (req, res, next) {
    try {
        const thumb = await thumbGet(req.params.board, req.params.slot);
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": thumb.length,
        });
        res.end(thumb);
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get thumb",
        });
    }
});

// router.get("/:exampleId", async function (req, res, next) {
//     try {
//         res.json({
//             status: "success",
//             data: await exampleGet(req.params.exampleId),
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             status: "error",
//             message: "Failed to get example details",
//         });
//     }
// });

module.exports = router;
