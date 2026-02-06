
'use strict';

const mongoSingle = require('@core/mongo-single');
const StatusItem = require("@core/StatusItem");
const logger = require("@utils/logger")(module);

module.exports = async () => {

    try {
        const dbSystem = await mongoSingle.get('system');
        if (!dbSystem) {
            throw new Error("failed to retrieve system info");
        }

        let description = `Device active and running`
        if (dbSystem?.modelName) {
            description = `Switch model ${dbSystem.modelName} active and running`;
        }

        return new StatusItem({
            key: `description`,
            message: description,
            type: "default",
            flags: [],
        })

    } catch (error) {
        logger.error(`status-getsystem: ${error.stack || error.message}`);
        return []
    }
};