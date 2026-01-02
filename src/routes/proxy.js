"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const restrict = require("@middleware/restrict");
const logger = require("@utils/logger")(module);
const axios = require("axios");
const userGet = require("@services/user-get");
const hashResponse = require("@core/hash-response");
const panelConfig = require("@models/panel-config");

// const authUser = require('@middleware/auth-user');
// const authGuest = require('@middleware/auth-guest');
// const authAdmin = require('@middleware/auth-admin');

const modulePort = process.env.MODULE_PORT || 3200;

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
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {

        try {

            // Check if request is for a valid panel before proxying
            const panel = await panelConfig.get(req.params?.panelid);
            if (!panel) {
                throw new Error("Invalid panel ID");
            }

            const axiosConfig = {
                method: req.method,
                url: `http://${req.params.panelid}:${modulePort}/api${req.url}`,
                responseType: "stream",
                headers: {
                    "Content-Type": "application/json",
                    "X-Forwarded-For": req?.ip,
                },
            };

            if (req.body) {
                axiosConfig["data"] = req.body;
            }

            // If a log object is in the request, pass it for logging and pad with panelId and username
            if (req.body?.log) {
                const user = await userGet(req.user);
                const message = req.body?.log?.message;
                delete req.body?.log?.message;
                logger.panel(message, { ...{ user: user, panelId: req.params.panelid }, ...req.body?.log });
            }

            const axiosResponse = await axios(axiosConfig);

            if (axiosResponse?.data?.action) {
                logger.info(req.body?.action);
            }

            res.status(axiosResponse.status);
            axiosResponse.data.pipe(res);
        } catch (error) {
            hashResponse(res, req, error);
        }
    })
);

module.exports = router;
