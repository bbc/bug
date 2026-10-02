"use strict";

require("module-alias/register");
const logger = require("@core/logger")(module);
const mongoDb = require("@core/mongo-db");
const app = require("./app");

const port = process.env.PORT || 3200;
const panelId = process.env.PANEL_ID;
const moduleName = process.env.MODULE;

const serve = async () => {
    await mongoDb.connect(panelId);
    app.listen(port, () => {
        logger.info(`${moduleName} API listening on port ${port.toString()}`);
    });
};

serve().catch((error) => {
    logger.error(error.stack || error.message || error);
    process.exitCode = 1;
});
