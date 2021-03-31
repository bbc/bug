const loki = require('lokijs');
const path = require('path');

module.exports = new Promise((resolve, reject) => {

    var dataPath = path.join(__dirname,'..','data','data.json');

    var db = new loki(dataPath, {
        autoload: true,
        autoloadCallback: () => {
            var entries = db.getCollection("outputs");
            if (entries === null) {
                entries = db.addCollection("outputs");
            }
            resolve(db);
        },
        autosave: true,
        autosaveInterval: 2000
    });
});
