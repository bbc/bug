"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const bugQuote = require("@services/bug-quote");
const bugShutdown = require("@services/bug-shutdown");
const bugRestart = require("@services/bug-restart");
const hashResponse = require("@core/hash-response");

/**
 * @swagger
 * /bug/quote:
 *    get:
 *      description: Gets a random and hilarious turn of phrase about invertebrates
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
 *      description: Shuts down the BUG application
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

/**
 * @swagger
 * /bug/restart:
 *    get:
 *      description: Restarts the BUG application and all associated modules
 *      tags: [bug]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get(
    "/restart",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await bugRestart(),
        });
    })
);

module.exports = router;
