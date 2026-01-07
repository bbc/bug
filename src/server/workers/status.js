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
const dockerContainer = require("@models/docker-container");

const modulePort = process.env.MODULE_PORT || 3200;
const databaseName = process.env.BUG_CONTAINER || "bug";

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

                if (eachPanelConfig.enabled) {
                    // check if panel has just started
                    const containerInfo = await dockerContainer.get(eachPanelConfig.id);
                    const startedInLast10Secs = startedInLastNSeconds(containerInfo?.status, 20);

                    // check if panelconfig has just been updated
                    const lastChanged = await panelConfigModel.getChangedDate(eachPanelConfig.id);
                    const configChangedInLast10Secs = lastChanged > Date.now() - 10000;

                    const maskStatusItems = startedInLast10Secs || configChangedInLast10Secs;

                    // check needsConfigured first ...
                    if (eachPanelConfig.needsConfigured) {
                        panelStatus.statusItems.push(
                            new StatusItem({
                                key: "panelnotconfigured",
                                message: [
                                    "Panel has not yet been configured for use",
                                    "Please configure the panel with the required fields",
                                ],
                                type: "critical",
                                flags: ["configurePanel"],
                            })
                        );
                    } else {
                        // find the module config for this panel
                        const thisModuleConfig = moduleConfig.find((o) => o.name === eachPanelConfig["module"]) ?? null;

                        if (eachPanelConfig.enabled && thisModuleConfig && thisModuleConfig.needsContainer) {
                            const url = `http://${eachPanelConfig.id}:${modulePort}/api/status`;
                            try {
                                let response = await axios.get(url);

                                if (response.data.status === "success") {
                                    if (maskStatusItems) {
                                        // check if we have any status items to filter out
                                        // if we have, then we'll add an info status to tell the user
                                        // otherwise do nothing

                                        const hasStatusItemsToMask =
                                            response.data.data.filter((s) =>
                                                ["warning", "critical", "error"].includes(s.type)
                                            ).length > 0;

                                        // now add any other non-error status items
                                        panelStatus.statusItems = panelStatus.statusItems.concat(
                                            response.data.data.filter(
                                                (s) => !["warning", "critical", "error"].includes(s.type)
                                            )
                                        );

                                        if (hasStatusItemsToMask) {
                                            panelStatus.statusItems.push(
                                                new StatusItem({
                                                    key: "ignoreerrors",
                                                    message: ["Panel starting - please wait"],
                                                    type: "info",
                                                    flags: [],
                                                })
                                            );
                                        }
                                    } else {
                                        // no need to suppress - just add the results
                                        panelStatus.statusItems = panelStatus.statusItems.concat(response.data.data);
                                    }
                                } else {
                                    throw new Error();
                                }
                            } catch (error) {
                                panelStatus.statusItems.push(
                                    new StatusItem({
                                        key: "panelnotreachable",
                                        message: [
                                            "Panel container is not reachable.",
                                            "There may be more information in the container logs",
                                        ],
                                        type: "critical",
                                        flags: ["restartPanel", "viewPanelLogs"],
                                    })
                                );
                            }
                        }
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
    await mongoDb.connect(databaseName);

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

const startedInLastNSeconds = (status, seconds) => {
    if (!status) {
        return false;
    }
    if (seconds === 1 && status.indexOf("Less than a second") > -1) {
        return true;
    }
    if (status.indexOf(" second") > -1) {
        const statusArray = status.split(" ");
        if (statusArray.length === 3) {
            if (!isNaN(statusArray[1])) {
                if (parseInt(statusArray[1]) < seconds + 1) {
                    return true;
                }
            }
        }
    }
    return false;
};
