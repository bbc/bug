'use strict';

const fs = require('fs').promises
const Logger = require('@utils/logger');

//TODO error handling with throw

module.exports = async (filepath,contents) => {
    try{
        const jsonString = await JSON.stringify(contents, null, 2);
        await fs.writeFile(`${filepath}.json`, jsonString);
        return true;
    }
    catch(error){
        logger.error(`write-json: ${error.stack | error.trace || error || error.message}`);
        return false;
    }
}