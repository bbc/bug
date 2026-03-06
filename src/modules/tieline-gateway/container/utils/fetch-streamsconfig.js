"use strict";

const logger = require("@core/logger")(module);
const ensureArray = require("@utils/ensure-array");

const parseIntSafe = (val) => (isNaN(val) ? 0 : parseInt(val, 10));

module.exports = async ({ tielineApi, mongoSingle }) => {
    try {
        const streamsConfig = await tielineApi.getStatic("/streamscfg.xml");
        const mixes = ensureArray(streamsConfig?.streamscfg?.mix);

        if (!mixes.length) {
            logger.info("streamsConfig: no mixes found - saving empty config");
            await mongoSingle.set("streamsConfig", [], 600);
            return;
        }

        const mapStream = (streamArray) =>
            ensureArray(streamArray).map((str) => ({
                id: str?._attributes?.id,
                numCh: parseIntSafe(str?._attributes?.numCh),
            }));

        const parsedStreamsConfig = mixes.map((eachMix) => {
            const attrs = eachMix?._attributes || {};
            return {
                id: attrs.id,
                encStream: mapStream(eachMix?.encStream),
                decStream: mapStream(eachMix?.decStream),
            };
        });

        logger.info(`streamsConfig: saved ${parsedStreamsConfig.length} mix(es) to DB`);

        await mongoSingle.set("streamsConfig", parsedStreamsConfig, 600);
    } catch (error) {
        logger.error(`streamsConfig: ${error?.message || error}`);
        throw error;
    }
};