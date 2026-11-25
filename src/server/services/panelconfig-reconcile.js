"use strict";

const panelConfigModel = require("@models/panel-config");
const moduleConfigModel = require("@models/module-config");
const panelConfigPush = require("@services/panelconfig-push");
const delivery = require("@services/panelconfig-delivery");
const logger = require("@core/logger")(module);

const reconcile = async () => {
    const [panels, modules] = await Promise.all([panelConfigModel.list(), moduleConfigModel.list()]);
    delivery.retain(new Set(panels.map((panel) => panel.id)));
    const containerModules = new Set(modules.filter((module) => module.needsContainer).map((module) => module.name));

    await Promise.all(
        panels
            .filter((panel) => panel.enabled && containerModules.has(panel.module))
            .map(async (panel) => {
                try {
                    await panelConfigPush(panel.id, { onlyIfNeeded: true });
                } catch (error) {
                    logger.warning(`Configuration delivery remains pending for ${panel.id}: ${error.message}`);
                }
            })
    );
};

exports.reconcile = reconcile;

exports.start = () => {
    const run = async () => {
        try {
            await reconcile();
        } catch (error) {
            logger.error(`Configuration reconciliation failed: ${error.message}`);
        }
        setTimeout(run, 10000);
    };
    run();
};
