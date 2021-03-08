'use strict';

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
const moduleList = require('@services/module-list');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/', async function (req, res, next) {
    var result = await moduleList(req);
    res.json(result);
});

module.exports = router;
