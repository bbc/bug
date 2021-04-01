const path = require('path');
const Datastore = require('nedb-promises')

module.exports = async (collection) => {

    try {
        //TODO add autocompaction
        const db = Datastore.create(path.join(__dirname,'..','data',`${collection}.json`));
        await db.load();
        return db;

    } catch (error) {
        console.log(error);
        return;
    }

}
