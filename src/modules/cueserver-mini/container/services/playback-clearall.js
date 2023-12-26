"use strict";

const cueServerSendCommand = require("@utils/cueserver-sendcommand");
const mongoSingle = require("@core/mongo-single");

module.exports = async (number) => {
    await cueServerSendCommand(`p1cl`);
    await cueServerSendCommand(`p2cl`);
    await cueServerSendCommand(`p3cl`);
    await cueServerSendCommand(`p4cl`);

    // update the db
    const consoleList = await mongoSingle.get("consoleList");
    const updatedConsoleList = consoleList.map((c) => {
        return {
            ...c,
            cue: null,
        };
    });
    return await mongoSingle.set("consoleList", updatedConsoleList, 60);
};
