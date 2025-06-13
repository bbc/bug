"use strict";
const ultrixWebApi = require("./ultrix-webapi");
const mongoSingle = require("@core/mongo-single");

module.exports = async ({ address, uiPort }) => {

    const response = await ultrixWebApi.get("source/agdata?aliasSetId=0", { address, uiPort });
    const sources = [];

    for (let eachSource of response) {
        const audioLevelCount = Object.keys(eachSource).filter(key => key.startsWith('AUD ')).length;
        const videoLevelCount = Object.keys(eachSource).filter(key => key === "VID").length;
        const type = videoLevelCount === 0 ? "audio" : (audioLevelCount === 0 ? "virtual" : "video");

        sources.push({
            name: eachSource.name,
            description: eachSource.description,
            id: eachSource.id,
            uiId: eachSource.uiId,
            type: type,
            audioLevelCount: audioLevelCount,
            videoLevelCount: videoLevelCount
        });
    }

    // save to db
    await mongoSingle.set("sources", sources, 60);
    await mongoSingle.set("sourcesRaw", response, 60);
};


