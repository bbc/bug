"use strict";

const mongoSingle = require("@core/mongo-single");
const cueServerSendCommand = require("@utils/cueserver-sendcommand");

module.exports = async (cueNumber, playlistId = 0) => {
    const command = playlistId ? `cue+${cueNumber}+p${playlistId}go` : `cue+${cueNumber}+go`;

    if (await cueServerSendCommand(command)) {
        // update the db
        const playbackList = await mongoSingle.get("consoleList");
        const updatedPlaybackList = playbackList.map((p) => {
            return {
                ...p,
                cue: p.number === playlistId ? cueNumber : p.cue,
            };
        });
        return await mongoSingle.set("consoleList", updatedPlaybackList, 60);
    }
};
