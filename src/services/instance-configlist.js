'use strict';

const logger = require('@utils/logger');
const globalConfig = require('@models/global-config');

module.exports = async () => {
    let result = await globalConfig.get();
    let list = result['panels'] ?? [];

    list.sort(function (a, b) {
        return (a.order < b.order) ? -1 : 1;
    });
    return list;
}