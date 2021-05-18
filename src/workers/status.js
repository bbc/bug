"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const mongoDb = require("@core/mongo-db");
const delay = require("delay");
const panelConfigModel = require("@models/panel-config");
const moduleConfigModel = require("@models/module-config");
const axios = require("axios");
const StatusItem = require("@core/StatusItem");
const mongoCollection = require("@core/mongo-collection");

const modulePort = process.env.MODULE_PORT || 3000;

const fetch = async () => {
    try {
        const panelStatusCollection = await mongoCollection("panelstatus");

        while (true) {
            // fetch config for all modules (to get the needsContainer
            const moduleConfig = await moduleConfigModel.list();

            // get a list of panels
            const panelConfig = await panelConfigModel.list();
            for (let eachPanelConfig of panelConfig) {
                // default values
                const panelStatus = {
                    panelId: eachPanelConfig.id,
                    timestamp: Date.now(),
                    statusItems: [],
                };

                // find the module config for this panel
                const thisModuleConfig = moduleConfig.find((o) => o.name === eachPanelConfig["module"]) ?? null;

                if (eachPanelConfig.enabled && thisModuleConfig && thisModuleConfig.needsContainer) {
                    const url = `http://${eachPanelConfig.id}:${modulePort}/api/status`;
                    try {
                        let response = await axios.get(url);
                        if (response.data.status === "success") {
                            panelStatus.statusItems = panelStatus.statusItems.concat(response.data.data);
                        } else {
                            throw new Error();
                        }
                    } catch (error) {
                        panelStatus.statusItems.push(
                            new StatusItem({
                                key: "panelnotreachable",
                                message: "Panel container is not reachable",
                                type: "critical",
                            })
                        );
                    }
                }

                // update the database
                await panelStatusCollection.replaceOne({ panelId: eachPanelConfig.id }, panelStatus, { upsert: true });
            }
            await delay(1000);
        }
    } catch (error) {
        logger.warning(`workers/status: ${error.stack || error.trace || error || error.message}`);
        return;
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect("bug-core");

    // Kick things off
    while (true) {
        try {
            await fetch();
        } catch (error) {
            logger.warning(`workers/status: ${error.stack || error.trace || error || error.message}`);
        }
        await delay(10000);
    }
};

main();
