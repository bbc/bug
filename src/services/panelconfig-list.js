'use strict';

const logger = require('@utils/logger');
const globalConfig = require('@models/global-config');
const modulePackage = require('@models/module-package');

module.exports = async () => {
    let result = await globalConfig.get();
    let list = result['panels'] ?? [];

    // also fetch module info
    let moduleList = await modulePackage.list();

    for(var i in list) {
        list[i]['modulePackage'] = moduleList.find(o => o.name === list[i]['module']) ?? null;
    }

    list.sort(function (a, b) {
        return (a.order < b.order) ? -1 : 1;
    });
    return list;
}