'use strict';

const logger = require('@utils/logger');
const modules = require('@models/modules');

module.exports = async () => {
    try {
        let list = await modules.listInfo();
        list.sort(function (a, b) {
            return (a.longname < b.longname) ? -1 : 1;
        });
        return list;
    } catch (error) {
        logger.warn(`module-list: ${error.trace || error || error.message}`);
    }
}