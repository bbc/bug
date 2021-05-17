"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const logger = require("@utils/logger")(module);
const axios = require("axios");
const hashResponse = require("@utils/hash-response");

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

const modulePort = process.env.MODULE_PORT || 3000;

/**
 * @swagger
 * /container/{panel_id}/{request_url}:
 *    get:
 *      description: Proxies a request from the main BUG service to the API of a Panel's container. The result is returned in the response.
 *      tags: [container]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: panel_id
 *          type: string
 *          required: true
 *          description: The panel ID to pass the request to.
 *        - in: path
 *          name: request_url
 *          type: string
 *          description: rest of the API request including any query strings.
 *      responses:
 *        '200':
 *          description: Success
 */
router.use(
    "/:panelid",
    asyncHandler(async (req, res) => {
        const url = `http://${req.params.panelid}:${modulePort}/api${req.url}`;
        try {
            const axiosConfig = {
                method: req.method,
                url: url,
                responseType: "stream",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            if (req.body) {
                axiosConfig["data"] = req.body;
            }
            if (req.body?.action) {
                logger.action(req.body?.action);
            }

            const axiosResponse = await axios(axiosConfig);

            if (axiosResponse?.data?.action) {
                logger.action(req.body?.action);
            }

            res.status(axiosResponse.status);
            axiosResponse.data.pipe(res);
        } catch (error) {
            hashResponse(res, req, error);
        }
    })
);

module.exports = router;
