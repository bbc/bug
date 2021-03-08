'use strict';

const fs = require('fs')
const logger = require('@utils/logger');
const globalConfig = require('@models/global-config');

module.exports = async () => {
    return await globalConfig.get();
}