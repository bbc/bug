//NAME: interface.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: System status

const express = require('express');
const status = express.Router();
const interfaceCombinedList = require('../../services/interface-combinedlist');
const interfaceCombined = require('../../services/interface-combined');

status.get('/', async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await interfaceCombinedList()
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to list interfaces" 
        });
    }

})

status.get('/:interfaceid', async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await interfaceCombined(req.params.interfaceid)
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to display interface id" 
        });
    }

})

module.exports = status;