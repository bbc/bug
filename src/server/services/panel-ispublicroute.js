const panelGet = require("@services/panel-get");
const logger = require("@utils/logger")(module);
const wcmatch = require("wildcard-match");

module.exports = async (panelId, route) => {
    try {
        if (panelId) {
            const panel = await panelGet(panelId);

            if (Array.isArray(panel._module?.publicRoutes)) {
                for (let publicRoute of panel._module?.publicRoutes) {
                    const isMatch = wcmatch(publicRoute);
                    if (isMatch(route)) {
                        logger.debug(`panel-ispublicroute: public route accessed - ${panelId}/${route}`);
                        return true;
                    }
                }
            }
        }
        return false;
    } catch (error) {
        logger.error(`panel-ispublicroute: ${error.stack}`);
        return false;
    }
};
