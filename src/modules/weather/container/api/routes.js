//NAME: routes.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 19/03/2021
//DESC: API routes orchestration

const express = require('express');
const router = express.Router();

const defaultRoute = require('./routes/default');
const status = require('./routes/status');
const weather = require('./routes/weather');

router
    .use('/',status)
    .use('/status',status)
    .use('/weather',weather)
    .use('*',defaultRoute)

module.exports = router;

