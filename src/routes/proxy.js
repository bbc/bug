'use strict';

const express = require('express');
const router = express.Router();
const http = require('http')
const logger = require('@utils/logger');
const systemBackup = require('@services/system-backup');
// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

const modulePort = process.env.MODULE_PORT || 3000 ;

//TODO
//Maybe replace http with axios?
//set the best route - currently BUG_CORE_DOMAIN/proxy/PANEL_ID/YOUR/REQUEST/HERE
//Handle more than get requests? Switch statement to change method?

router.use('/:panel_id/', async function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    const options = {
        host: req.params.panel_id,
        path: '/api'+req.url,
        port: modulePort,
        timeout: 3000,
        method: req.method.toUpperCase().replace(/delete/,"del")
    };

    http.get(options, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            res.send(data);
        });

        }).on("error", (err) => {
            res.json(err);
        });

});

module.exports = router;