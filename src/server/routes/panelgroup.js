"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const panelGroupRename = require("@services/panelgroup-rename");
const panelGroupDelete = require("@services/panelgroup-delete");
const restrict = require("@middleware/restrict");
const logger = require("@utils/logger")(module);
const hashResponse = require("@core/hash-response");

/**
 * @swagger
 * /panelgroup:
 *   put:
 *     description: Renames a group (all panels with the same group name will be updated)
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: group
 *         schema:
 *           type: string
 *         description: The existing group name
 *         required: true
 *       - in: path
 *         name: newGroupName
 *         schema:
 *           type: string
 *         description: The new group name
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully renamed the panel group.
 *         schema:
 *           type: object
 *       500:
 *         description: Failed to rename the panel group.
 *         schema:
 *           type: object
 */
router.put(
    "/:groupName/:newGroupName",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const result = await panelGroupRename(req.params.groupName, req.params.newGroupName);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? "Renamed panel group" : "Failed to rename panel group",
            data: result,
        });
    })
);

/**
 * @swagger
 * /panelgroup/{group}:
 *   delete:
 *     description: Deletes all panels in a group
 *     tags: [panel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: group
 *         schema:
 *           type: string
 *         description: The group name to delete
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted all panels in the group.
 *         schema:
 *           type: object
 *       500:
 *         description: Failed to delete panels in the group.
 *         schema:
 *           type: object
 */
router.delete(
    "/:groupName",
    restrict.to(["admin", "user"]),
    asyncHandler(async (req, res) => {
        const result = await panelGroupDelete(req.params.groupName);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            message: result ? "Deleted panel group" : "Failed to delete panel group",
            data: result,
        });
    })
);

module.exports = router;
