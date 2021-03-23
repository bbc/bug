const lokiDb = require('../utils/db');

module.exports = async () => {
    var db = await lokiDb;
    var dbInterfaces = await db.getCollection("interfaces");

    return await dbInterfaces.find();
}

