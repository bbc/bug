"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const restrict = require("@middleware/restrict");
const logger = require("@core/logger")(module);
const axios = require("axios");
const userGet = require("@services/user-get");
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
 *        '404':
 *          description: Panel not found, or the container returned 404.
 *        '502':
 *          description: The panel container could not be reached.
 *        '504':
 *          description: The panel container request timed out.
 */
router.use(
    "/:panelid",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        let panel;
        try {
            panel = await panelConfig.get(req.params.panelid);
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }
        if (!panel) {
            return res.status(404).json({ status: "error", code: "PANEL_NOT_FOUND", message: "Panel not found" });
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

        let axiosResponse;
        try {
            axiosResponse = await axios(axiosConfig);
        } catch (error) {
            if (error.response) {
                res.status(error.response.status);

                const contentType = error.response?.headers?.["content-type"];
                if (contentType) {
                    res.set("Content-Type", contentType);
                }

                if (error.response.data && typeof error.response.data.pipe === "function") {
                    return error.response.data.pipe(res);
                }

                return res.json({
                    status: "error",
                    message: error.message,
                });
            }

            if (!error.request) throw error;

            const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
            logger.warning(`Panel ${req.params.panelid} request failed: ${error.message}`);
            return res.status(timedOut ? 504 : 502).json({
                status: "error",
                message: timedOut ? "Panel container request timed out" : "Panel container unavailable",
            });
        }

        if (axiosResponse?.data?.action) {
            logger.info(req.body?.action);
        }

        const contentType = axiosResponse?.headers?.["content-type"];
        if (contentType) {
            res.set("Content-Type", contentType);
        }

        res.status(axiosResponse.status);
        axiosResponse.data.pipe(res);
    })
);

module.exports = router;
