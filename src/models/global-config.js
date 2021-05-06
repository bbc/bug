// 'use strict';

// const fs = require('fs')
// const util = require('util');
// const readfile = util.promisify(fs.readFile);
// const logger = require('@utils/logger')(module);
// const readJson = require('@utils/read-json');

// exports.get = async function() {
//     //TODO add caching
//     try {
//         return await readJson("config/global.json");
//     } catch (error) {
//         logger.warning(`${error.trace || error || error.message}`);
//     }
// }

// exports.getPanel = async function() {
//     try {
//         var result = await exports.get();
//         console.log(result);
//     } catch (error) {
//         logger.warning(`${error.trace || error || error.message}`);
//     }
// }
