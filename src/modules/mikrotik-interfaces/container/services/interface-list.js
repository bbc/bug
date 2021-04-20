const mongoCollection = require('../utils/mongo-collection');

module.exports = async () => {

    const dbInterfaces = await mongoCollection('interfaces');
    let interfaces = await dbInterfaces.find().toArray();
    if(!interfaces) {
        return [];
    }
    return interfaces;
}

