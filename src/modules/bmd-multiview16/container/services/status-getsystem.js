
'use strict';

const mongoSingle = require('@core/mongo-single');
const StatusItem = require("@core/StatusItem");

module.exports = async () => {

    try {
        const dbSystem = await mongoSingle.get('videohub_device');
        if (!dbSystem) {
            return []
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
        // re-throw error so the api handler catches it
        console.error(`status-getsystem: ${error.message}`);
        throw error;
    }
};