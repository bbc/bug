"use strict";

const register = require("module-alias/register");
const logger = require("@core/logger")(module);
const mongoDb = require("@core/mongo-db");
const app = require("./app");

const port = process.env.PORT || 3200;
const panelId = process.env.PANEL_ID;
const moduleName = process.env.MODULE;

const serve = async () => {
    try {
        await mongoDb.connect(panelId);

        app.listen(port, () => {
            logger.info(`${moduleName} API listening on port ${port.toString()}`);
        });
    } catch (error) {
        throw error;
    }
};

serve();
