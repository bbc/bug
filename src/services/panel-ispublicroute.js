//NAME: panel-ispublicroute.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 21/06/2021
//DESC: Middleware to check if route in panel api bypasses auth

const panelGet = require("@services/panel-get");
const logger = require("@utils/logger")(module);

module.exports = async (panelId, route) => {
    try {
        if (panelId) {
            const panel = await panelGet(panelId);
            if (Array.isArray(panel._module?.publicRoutes) && panel._module?.publicRoutes.includes(route)) {
                logger.debug(`Public route accessed - ${panelId}/${route}`);
                return true;
            }
        }
        return false;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to evaulate public routes for panel with id ${panelId}`);
    }
};
