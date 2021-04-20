//NAME: app.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: Mikrotik Interfaces module

//server.js
const mongoDb = require('../utils/mongo-db');
const app = require("./app");
const port = process.env.MODULE_PORT || 3200;
const myPanelId = 'bug-containers'; // 'thisisapanelidhonest'; //TODO

const boot = async () => {

    try {
        await mongoDb.connect(myPanelId);
        app.listen(port, () => {
            console.log("mirotik-interfaces api listening on port "+port.toString());
        });
    } catch (error) {
        throw error;
    }
};

boot();

