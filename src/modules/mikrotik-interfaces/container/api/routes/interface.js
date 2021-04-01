//NAME: interface.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: System status

const express = require('express');
const status = express.Router();
const interfaceList = require('../../services/interface-list');

status.get('/', async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await interfaceList()
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to list interfaces" 
        });
    }

})

module.exports = status;