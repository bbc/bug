"use strict";

const logger = require("@utils/logger")(module);
const mongoSingle = require("@core/mongo-single");
const panelConfigModel = require("@models/panel-config");

module.exports = async () => {
    try {
        // fetch panel/module config
        const panelConfig = await panelConfigModel.list();

        // get docker stats
        const containersResult = await mongoSingle.get("systemHealth");

        if (containersResult?.containers) {
            for (let eachContainer of containersResult?.containers) {
                const matchingPanel = panelConfig.find((panel) => panel.id === eachContainer.name);
                if (matchingPanel) {
                    // it's a panel
                    eachContainer.type = "panel";
                    eachContainer.name = matchingPanel?.title;
                    eachContainer.module = matchingPanel?.module;
                } else {
                    // it's a core container
                    eachContainer.type = "core";
                    eachContainer.module = "BUG core";
                }
            }
        }

        return {
            data: containersResult?.containers,
        };
    } catch (error) {
        logger.error(`system-containerhealth: ${error.stack}`);
        throw new Error(`Failed to retrieve container health`);
    }
};
