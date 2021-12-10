"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const bugQuote = require("@services/bug-quote");
const bugShutdown = require("@services/bug-shutdown");
const hashResponse = require("@core/hash-response");

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
router.get(
    "/quote",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await bugQuote(),
        });
    })
);

/**
 * @swagger
 * /bug/shutdown:
 *    get:
 *      description: Shuts down your BUG.
 *      tags: [bug]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get(
    "/shutdown",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await bugShutdown(),
        });
    })
);

module.exports = router;
