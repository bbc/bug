
'use strict';

const mongoSingle = require('@core/mongo-single');
const StatusItem = require("@core/StatusItem");

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
        // re-throw error so the api handler catches it
        console.error(`status-getsystem: ${error.message}`);
        throw error;
    }
};