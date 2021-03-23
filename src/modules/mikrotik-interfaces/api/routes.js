//NAME: routes.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 19/03/2021
//DESC: API routes orchestration

const express = require('express');
const router = express.Router();

// const defaultRoute = require('./routes/default');
const status = require('./routes/status');
const interface = require('./routes/interface');

router
    // .use('/', status)
    .use('/status', status)
    .use('/interface', interface)
    .use('*', (req, res) => {
        res.sendStatus(404);
    });

module.exports = router;