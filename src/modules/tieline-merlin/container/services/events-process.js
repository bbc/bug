"use strict";

const processCxnStatus = require("@services/process-cxnstatus");
const processCxnStatistics = require("@services/process-cxnstatistics");
const processGroupStatistics = require("@services/process-groupstatistics");
const fetchConnections = require("@services/fetch-connections");
const fetchLoadedProgram = require("@services/fetch-loadedprogram");

module.exports = async (TielineApi, data) => {
    for (const eachEvent of data) {
        // console.log(eachEvent["_attributes"]["event"]);
        switch (eachEvent["_attributes"]["event"]) {
            case "statistics":
                processCxnStatistics(eachEvent);
                processGroupStatistics(eachEvent);
                return;
            case "cxn-status":
                processCxnStatus(TielineApi, eachEvent);
                return;
            case "cxn-create":
                fetchConnections(TielineApi);
                return;
            case "gpi-status-change":
                // we don't care
                return;
            case "cxn-live-prop":
                fetchConnections(TielineApi);
                return;
            case "alarm-led-status-changed":
                // we don't care
                return;
            case "output-source-state":
                // don't know what this is. Ignore
                return;
            case "current-rules-changed":
                // nope
                return;
            case "reload-matrix":
                // not a chance
                return;
            case "prog-prop":
                fetchLoadedProgram(TielineApi);
                return;
            case "prog-loaded":
                // just loaded (or unloaded) a program
                fetchLoadedProgram(TielineApi);
                return;
            default:
                console.warn(`unhandled event: ${JSON.stringify(eachEvent)}`);
                return;
        }
    }
};
