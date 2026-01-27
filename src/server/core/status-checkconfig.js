"use strict";

/**
 * core/status-checkconfig.js
 * Checks the status panel config
 * Occasionally due to a fault a panel can be missing its config - this checks if that's the case and raises a critical error
 * 0.0.1 27/01/2026 - Created first version (GH)
 */

const StatusItem = require("@core/StatusItem");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    if (config === null) {
        return [
            new StatusItem({
                key: "panelnoconfig",
                message: [
                    "Panel has not yet been configured for use"
                ],
                type: "critical",
                flags: ["configurePanel"],
            })
        ];
    }

    return []
};
