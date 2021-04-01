const db = require('../utils/db');

module.exports = async () => {

    dbInterfaces = await db('interfaces');

    let interfaces = await dbInterfaces.find();
    interfaces.sort((a, b) => (a.name > b.name) ? 1 : -1)
    return interfaces;
}

