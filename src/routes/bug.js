'use strict';

const express = require('express');
const router = express.Router();
const bugQuote = require('@services/bug-quote');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/quote', async function (req, res, next) {
    var result = await bugQuote();
    res.json(result);
});

module.exports = router;
