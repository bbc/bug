'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = async (collectionName) => {

    const dbName = 'bug-containers';

    // Connection URL
    const url = 'mongodb://bug-mongo:27017';

    // Database Name
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // try to connect
    try {
        await client.connect();

        const db = client.db(dbName);
        return db.collection(collectionName);

    } catch (err) {
        console.log(err.stack);
    }

}


// const path = require('path');
// const Datastore = require('nedb-promises')

// module.exports = async (collection) => {

//     try {
//         const db = Datastore.create(path.join(__dirname,'..','data',`${collection}.json`));
//         db.persistence.setAutocompactionInterval(600)
//         await db.load();
//         return db;

//     } catch (error) {
//         console.log(error);
//         return;
//     }

// }
