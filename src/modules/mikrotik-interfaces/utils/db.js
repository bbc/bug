const loki = require('lokijs');
const path = require('path');

module.exports = new Promise((resolve, reject) => {

    var dataPath = path.join(__dirname,'..','data','data.json');

    var db = new loki(dataPath, {
        autoload: true,
        autoloadCallback: () => {
            var entries = db.getCollection("interfaces");
            if (entries === null) {
                entries = db.addCollection("interfaces");
            }
            resolve(db);
        },
        autosave: true,
        autosaveInterval: 4000 // save every four seconds for our example
    });
});
