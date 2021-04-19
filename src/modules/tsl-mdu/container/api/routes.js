//NAME: routes.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 19/03/2021
//DESC: API routes orchestration

const express = require('express');
const router = express.Router();

const output = require('./routes/output');
const status = require('./routes/status');
const config = require('./routes/config');

router
    .use('/output', output)
    .use('/status', status)
    .use('/config', config)
    .use('*', (req, res) => {
        res.sendStatus(404);
    });

module.exports = router;