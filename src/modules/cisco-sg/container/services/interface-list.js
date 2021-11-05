'use strict';

const mongoCollection = require('@core/mongo-collection');

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {

    const dbInterfaces = await mongoCollection('interfaces');
    let interfaces = await dbInterfaces.find().toArray();
    if (!interfaces) {
        return [];
    }

    return interfaces;
}

