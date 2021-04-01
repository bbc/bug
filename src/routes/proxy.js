'use strict';

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const axios = require('axios')
// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

const modulePort = process.env.MODULE_PORT || 3000 ;

router.use('/:panelid', async function(req, res) {

    var url = 'http://' + req.params.panelid + ':' + modulePort + '/api' + req.url;

    try {
        var axiosConfig = {
            method: req.method,
            url: url,
            responseType: "stream",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if(req.body) {
            axiosConfig['data'] = req.body;
        }

        let axiosResponse = await axios(axiosConfig);
        res.status(axiosResponse.status);
        axiosResponse.data.pipe(res);
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;
