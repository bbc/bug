
'use strict';

const mongoSingle = require('@core/mongo-single');
const StatusItem = require("@core/StatusItem");
const logger = require("@core/logger")(module);

module.exports = async () => {

    try {
        const dbSystem = await mongoSingle.get('videohub_device');
        if (!dbSystem) {
            throw new Error("no result from database");
        }

        if (!dbSystem?.friendly_name) {
            return new StatusItem({
                key: `nodescription`,
                message: `Device active and running`,
                type: "default",
                flags: [],
            })
        }

        const description = `Device ${dbSystem.friendly_name} active and running`;

        return new StatusItem({
            key: `description`,
            message: description,
            type: "default",
            flags: [],
        })

    } catch (error) {
        err.message = `status-getsystem: ${err.stack || err.message}`;
        logger.error(err.message);
        return [];
    }
};