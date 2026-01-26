"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const panelLogGet = require("@services/docker-getlogs");
const restrict = require("@middleware/restrict");

/**
 * @swagger
 * /{containerId}:
 *   get:
 *     summary: Stream container/panel logs
 *     description: |
 *       Streams the last 1000 log lines for the specified container
 *       and continues to stream new log entries in real time using
 *       Server-Sent Events (SSE).
 *
 *       NOTE: This endpoint returns a long-lived connection and will not
 *       complete immediately. Swagger UI does not display streaming
 *       responses.
 *     tags:
 *       - panel
 *     parameters:
 *       - in: path
 *         name: containerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Panel, BUG app or mongo container ID
 *     responses:
 *       200:
 *         description: Log stream started (SSE)
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               example: |
 *                 data: 2026-01-26T10:15:01Z server started
 *
 *                 data: 2026-01-26T10:15:02Z listening on port 3000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Panel not found
 */
router.get(
    "/:containerId",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res, next) => {
        try {
            const { containerId } = req.params;
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders?.();

            const logStream = await panelLogGet(containerId, { tail: 1000, follow: true });

            logStream.on("data", (chunk) => {
                // Send as SSE event with type info
                res.write(`event: log\ndata: ${JSON.stringify(chunk)}\n\n`);
            });

            logStream.on("end", () => res.end());
            logStream.on("error", (err) => {
                res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
                res.end();
            });

            req.on("close", () => {
                logStream.destroy();
            });
        } catch (err) {
            next(err);
        }
    })
);

module.exports = router;
