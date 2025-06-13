"use strict";
const ultrixWebApi = require("./ultrix-webapi");
const mongoSingle = require("@core/mongo-single");

module.exports = async ({ address, uiPort }) => {

    const response = await ultrixWebApi.get("destination/agdata?aliasSetId=0", { address, uiPort });
    const destinations = [];

    for (let eachDestination of response) {
        const audioLevelCount = Object.keys(eachDestination).filter(key => key.startsWith('AUD ')).length;
        const videoLevelCount = Object.keys(eachDestination).filter(key => key === "VID").length;
        const isPip = eachDestination?.VID?.n?.includes("pip") ?? false;
        const type = isPip ? "pip" : (videoLevelCount === 0 ? "audio" : "video");

        destinations.push({
            name: eachDestination.name,
            description: eachDestination.description,
            id: eachDestination.id,
            uiId: eachDestination.uiId,
            type: type,
            audioLevelCount: audioLevelCount,
            videoLevelCount: videoLevelCount
        });
    }

    // save to db
    await mongoSingle.set("destinations", destinations, 60);
    await mongoSingle.set("destinationsRaw", response, 60);
};


