
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

        if (!dbSystem?.description) {
            return new StatusItem({
                key: `nodescription`,
                message: `Device active and running`,
                type: "default",
                flags: [],
            })
        }

        let description = dbSystem.description;
        const match = description.match(/\((C1300[^)]+)\)/);

        if (match) {
            description = `Switch model ${match[1]} active and running`;
        }

        return new StatusItem({
            key: `description`,
            message: description,
            type: "default",
            flags: [],
        })

    } catch (error) {
        logger.error(`status-getsystem: ${error.message}`);
        return []
    }
};