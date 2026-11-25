"use strict";

const logger = require("@core/logger")(module);
const panelConfigModel = require("@models/panel-config");
const delivery = require("@services/panelconfig-delivery");
const docker = require("@utils/docker");
const axios = require("axios");
const modulePort = process.env.MODULE_PORT || 3200;
const pending = new Map();

module.exports = (panelId, { onlyIfNeeded = false } = {}) => {
    const previous = pending.get(panelId) || Promise.resolve();
    const push = async () => {
        const config = await panelConfigModel.get(panelId);

        let container;
        try {
            container = await docker.getContainer(panelId).inspect();
        } catch (error) {
            delivery.clear(panelId);
            if (error.statusCode === 404) return false;
            throw error;
        }
        if (!container.State.Running) {
            delivery.clear(panelId);
            return false;
        }
        if (onlyIfNeeded && delivery.matches(config, container)) return true;

        delivery.clear(panelId);
        const url = `http://${panelId}:${modulePort}/api/config`;
        try {
            const response = await axios.put(url, config, { timeout: 5000 });
            if (response.status !== 200 || response.data?.status !== "success" || response.data?.data !== true) {
                throw new Error("Container did not accept the configuration");
            }
            delivery.accept(config, container);
            logger.info(`successfully pushed config to ${url}`);
            return true;
        } catch (error) {
            logger.warning(`Failed to push config for panel ${panelId}: ${error.message}`);
            throw error;
        }
    };
    const current = previous.then(push, push);
    pending.set(panelId, current);
    current.then(
        () => {
            if (pending.get(panelId) === current) pending.delete(panelId);
        },
        () => {
            if (pending.get(panelId) === current) pending.delete(panelId);
        }
    );
    return current;
};
