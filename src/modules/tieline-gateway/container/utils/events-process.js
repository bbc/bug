"use strict";

const processCxnStatus = require("@utils/process-cxnstatus");
const processCxnStatistics = require("@utils/process-cxnstatistics");
const processGroupStatistics = require("@utils/process-groupstatistics");
const fetchConnections = require("@utils/fetch-connections");
const fetchLoadedProgram = require("@utils/fetch-loadedprogram");
const logger = require("@core/logger")(module);

module.exports = async (props) => {
    for (const event of props?.payload) {
        const propsWithData = { ...props, event }
        switch (event["_attributes"]["event"]) {
            case "statistics":
                processCxnStatistics(propsWithData);
                processGroupStatistics(propsWithData);
                return;
            case "cxn-status":
                processCxnStatus(propsWithData);
                return;
            case "cxn-create":
                fetchConnections(propsWithData);
                return;
            case "gpi-status-change":
                // we don't care
                return;
            case "cxn-live-prop":
                fetchConnections(propsWithData);
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
                fetchLoadedProgram(propsWithData);
                return;
            case "prog-loaded":
                // just loaded (or unloaded) a program
                fetchLoadedProgram(propsWithData);
                return;
            case "prog-group-add-cxn":
                fetchConnections(propsWithData);
                return;
            case "prog-group-remove-cxn":
                fetchConnections(propsWithData);
                return;
            case "digest-change":
                // do nothing
                return;
            case "ref-level-changed":
                // do nothing
                return;
            case "connected-led-status-changed":
                // do nothing
                return;
            default:
                logger.warning(`unhandled event: ${JSON.stringify(event)}`);
                return;
        }
    }
};
