const express = require('express');
const router = express.Router();
const configGet = require('../../services/config-get');
const configPut = require('../../services/config-put');

router.get('/', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await configGet()
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to fetch panel config" 
        });
    }
});

router.put('/', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await configPut(req.body)
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to update panel config" 
        });
    }
});

module.exports = router;
