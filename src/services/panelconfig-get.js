'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const modulePackage = require('@models/module-package');

module.exports = async (panelId) => {
    var result = await panelConfig.get(panelId);

    result['modulePackage'] = modulePackage.get(result['module']) ?? null;
    return result;

}