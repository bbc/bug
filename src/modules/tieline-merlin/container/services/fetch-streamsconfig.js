"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (TielineApi) => {
    // fetch the data using axios/xml
    const streamsConfig = await TielineApi.getStatic("/streamscfg.xml");

    const parsedStreamsConfig = [];

    const streamMapper = (streamArray) => {
        if (!streamArray) {
            return [];
        }
        if (!Array.isArray(streamArray)) {
            streamArray = [streamArray];
        }
        return streamArray.map((str) => {
            return {
                id: str?._attributes.id,
                numCh: parseInt(str._attributes.numCh),
            };
        });
    };

    if (streamsConfig?.streamscfg?.mix) {
        for (let eachMix of streamsConfig?.streamscfg?.mix) {
            parsedStreamsConfig.push({
                id: eachMix?._attributes.id,
                encStream: streamMapper(eachMix.encStream),
                decStream: streamMapper(eachMix.decStream),
            });
        }
    }

    // save to DB
    await mongoSingle.set("streamsConfig", parsedStreamsConfig, 600);
};
