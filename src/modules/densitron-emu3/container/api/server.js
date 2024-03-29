"use strict";

const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");

process.on("uncaughtException", function (exception) {
    console.log(exception);
});

const app = require("./app");

const port = process.env.PORT || 3200;
const myPanelId = process.env.PANEL_ID;

const serve = async () => {
    try {
        await mongoDb.connect(myPanelId);

        app.listen(port, () => {
            console.log("tsl-mdu listening on " + port.toString());
        });
    } catch (error) {
        throw error;
    }
};

serve();
