'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');

module.exports = async (panelId) => {
    return await panelConfig.get(panelId);
}