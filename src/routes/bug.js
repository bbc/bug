'use strict';

const express = require('express');
const router = express.Router();
const bugQuote = require('@services/bug-quote');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

router.get('/quote', async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await bugQuote()
        });
    } catch (error) {
        res.json({ error: "Failed to fetch quote" });
    }
});

module.exports = router;
