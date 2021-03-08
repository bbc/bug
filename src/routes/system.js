'use strict';

const express = require('express');
const router = express.Router();
const logger = require('@utils/logger');
// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/hello', function (req, res, next) {
    res.json("Hello");
    logger.info("HELLO");
});

module.exports = router;
