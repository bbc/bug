"use strict";

const cueServerSendCommand = require("@utils/cueserver-sendcommand");
const mongoSingle = require("@core/mongo-single");

module.exports = async (number) => {
    if (await cueServerSendCommand(`p${number}cl`)) {
        // update the db
        const consoleList = await mongoSingle.get("consoleList");
        const updatedConsoleList = consoleList.map((c) => {
            return {
                ...c,
                cue: c.number === number ? null : c.cue,
            };
        });
        return await mongoSingle.set("consoleList", updatedConsoleList, 60);
    }
    console.log(`playback-select: failed to send command`);
    return false;
};
