"use strict";

const logger = require("@core/logger")(module);
const convert = require("xml-js");
const ensureArray = require("@utils/ensure-array");

module.exports = async ({ tielineApi, mongoSingle }) => {
    try {
        const alarmsResult = await tielineApi.get("/api/get_current_alarms");
        const xml = alarmsResult?.result?.["xml-response-data"]?._cdata;

        let alarmsForDb = [];

        if (xml) {
            const alarmsJsObject = convert.xml2js(xml, { compact: true });

            const alarms = ensureArray(
                alarmsJsObject?.["g4am:alarmHistory"]?.["g4am:alarm"]
            );

            alarmsForDb = alarms
                .filter(
                    alarm =>
                        alarm?.["g4am:stateHistory"]?._attributes?.state === "ACTIVE"
                )
                .map(alarm => {
                    const attrs = alarm._attributes || {};

                    return {
                        id: attrs.id,
                        title: `${attrs.asset} - ${attrs.description}`,
                        level: attrs.severity,
                        key: attrs.type,
                    };
                });
        }

        if (alarmsForDb.length > 0) {
            logger.warning(`alarms: found ${alarmsForDb.length} alarm(s) - saving to db`);
        }

        await mongoSingle.set("alarms", alarmsForDb, 60);
    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        logger.error(`alarms: ${error.message}`);
        throw error;
    }
};