'use strict';

const logger = require('@utils/logger');
const instanceConfig = require('@models/instance-config');

module.exports = async (instanceId) => {
    return await instanceConfig.get(instanceId);
}