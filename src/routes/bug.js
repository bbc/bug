'use strict';

const express = require('express');
const router = express.Router();
const bugQuote = require('@services/bug-quote');

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

/**
 * @swagger
 * /bug/quote:
 *    get:
 *      description: Gets a random and hillarous turn of phrase about invertebrates.
 *      tags: [bug]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
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
