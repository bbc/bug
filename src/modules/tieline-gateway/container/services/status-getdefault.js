
'use strict';

const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {

    try {

        const dbDevice = await mongoSingle.get("device");
        const dbLoadedProgram = await mongoSingle.get("loadedProgram");

        let message = "";

        if (dbLoadedProgram) {
            message = `Program '${dbLoadedProgram.name}' loaded with ${dbLoadedProgram?.groups?.length} endpoint(s) configured`;
        }
        else {
            message = `Device '${dbDevice.hostname}' connected and ready`;
        }

        return new StatusItem({
            message: message,
            key: "defaultservice",
            type: "default",
            flags: [],
        })


    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};