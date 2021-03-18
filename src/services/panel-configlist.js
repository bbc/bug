'use strict';

const logger = require('@utils/logger');
const globalConfig = require('@models/global-config');
const modules = require('@models/modules');

module.exports = async () => {
    let result = await globalConfig.get();
    let list = result['panels'] ?? [];

    // also fetch module info
    let moduleList = await modules.listInfo();

    for(var i in list) {
        list[i]['moduleInfo'] = moduleList.find(o => o.name === list[i]['module']) ?? null;
    }

    list.sort(function (a, b) {
        return (a.order < b.order) ? -1 : 1;
    });
    return list;
}