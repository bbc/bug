"use strict";

const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const workerStore = require("@core/worker-store");
const app = require("./app");
const randomWords = require("random-words");

const port = process.env.PORT || 3200;
const myPanelId = process.env.PANEL_ID || `mikrotik-interfaces-${randomWords()}`;

const serve = async () => {
    try {
        await mongoDb.connect(myPanelId);

        app.listen(port, () => {
            console.log("mirotik-interfaces api listening on port " + port.toString());
        });
    } catch (error) {
        throw error;
    }
};

serve();
