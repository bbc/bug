const path = require('path');
const Datastore = require('nedb-promises')

module.exports = async (collection) => {

    try {
        const db = Datastore.create(path.join(__dirname,'..','data',`${collection}.json`));
        db.persistence.setAutocompactionInterval(600)
        await db.load();
        return db;

    } catch (error) {
        console.log(error);
        return;
    }

}
