const express = require('express');
const config = express.Router();
const configGet = require('../../services/config-get');
const configPut = require('../../services/config-put');

config.get('/', async function (req, res) {
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

config.put('/', async function (req, res) {
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

module.exports = config;
