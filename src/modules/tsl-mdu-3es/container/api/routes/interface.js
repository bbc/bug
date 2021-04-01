//NAME: interface.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: System status

const express = require('express');
const status = express.Router();
const interfaceList = require('../../services/interface-list');

status.get('/', async function (req, res) {
    var result = await interfaceList(req);
    res.json(result);
})

module.exports = status;