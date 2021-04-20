//NAME: app.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: Mikrotik Interfaces module

//server.js
const mongoDb = require('../utils/mongo-db');
const app = require("./app");
<<<<<<< HEAD
let port = process.env.PORT || 3200;
=======
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
>>>>>>> 2d450d4318d9c867d524d2b77cf810734f923061

