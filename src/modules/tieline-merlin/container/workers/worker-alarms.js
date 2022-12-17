"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const tielineApi = require("@utils/tieline-api");
const convert = require("xml-js");
const ensureArray = require("@utils/ensure-array");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);

    const TielineApi = new tielineApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // Kick things off
    console.log(`worker-alarms: starting ...`);

    // use an infinite loop
    while (true) {
        try {
            const alarmsResult = await TielineApi.get("/api/get_current_alarms");
            //     const alarmsResult = {
            //         result: {
            //             "xml-response-data": {
            //                 _cdata: `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
            //     <g4am:alarmHistory xmlns:g4am="http://www.tieline.com/G4/AlarmManagement" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.tieline.com/G4/AlarmManagement AlarmManagement.xsd">

            //     <g4am:alarm asset="Power Supply: 2" description="Power supply failure" id="476" severity="CRITICAL" type="PSU_FAILURE">
            //     <g4am:stateHistory state="ACTIVE" timestamp="2022-09-07T06:40:16"/>
            //   </g4am:alarm>
            //   <g4am:alarm asset="Power Supply: 1" description="Power supply failure" id="472" severity="CRITICAL" type="PSU_FAILURE">
            //   <g4am:stateHistory state="ACTIVE" timestamp="2022-09-07T06:40:16"/>
            // </g4am:alarm>

            //     </g4am:alarmHistory>`,
            //             },
            //         },
            //     };

            const alarmsForDb = [];
            if (alarmsResult?.result?.["xml-response-data"]?.["_cdata"]) {
                const alarmsJsObject = convert.xml2js(alarmsResult?.result?.["xml-response-data"]?.["_cdata"], {
                    compact: true,
                });
                const alarms = ensureArray(alarmsJsObject?.["g4am:alarmHistory"]["g4am:alarm"]);
                for (const eachAlarm of alarms) {
                    if (eachAlarm?.["g4am:stateHistory"]?.["_attributes"]?.["state"] === "ACTIVE") {
                        alarmsForDb.push({
                            id: eachAlarm["_attributes"]?.["id"],
                            title: `${eachAlarm["_attributes"]?.["asset"]} - ${eachAlarm["_attributes"]?.["description"]}`,
                            level: eachAlarm["_attributes"]?.["severity"],
                            key: eachAlarm["_attributes"]?.["type"],
                        });
                    }
                }
            }
            await mongoSingle.set("alarms", alarmsForDb, 60);
        } catch (error) {
            console.log(`worker-connections: ${error}`);
        }

        // delay before doing it all again ...
        await delay(10000);
    }
};

main();
