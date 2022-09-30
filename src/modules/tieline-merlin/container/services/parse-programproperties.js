"use strict";

const ensureArray = require("@utils/ensure-array");
const mongoSingle = require("@core/mongo-single");

module.exports = async (programPropertiesResult) => {
    const streamsConfig = await mongoSingle.get("streamsConfig");

    const getChannelCount = (mixerId, encId) => {
        const stream = streamsConfig.find((stream) => stream?.id.toString() === mixerId.toString());
        if (stream) {
            const encObj = stream.encStream.find((enc) => parseInt(enc?.id) === parseInt(encId));
            if (encObj) {
                return encObj.numCh;
            }
        }
        return 0;
    };

    const program = {
        description: programPropertiesResult?.["result"]?.["prog-prop"]?.["DESCRIPTION"]?.["_text"],
        groups: [],
    };

    // make sure groups is an array
    const programGroups = ensureArray(programPropertiesResult?.["result"]?.["prog-prop"]?.["Group"]);

    for (const eachGroup of programGroups) {
        const groupArray = {};
        groupArray["group"] = parseInt(eachGroup?.["_attributes"]?.["group-order"]);
        groupArray["id"] = eachGroup?.["_attributes"]?.["group-id"];
        groupArray["name"] = eachGroup?.["name"]?.["_text"];
        groupArray["mixer"] = parseInt(programPropertiesResult?.["result"]?.["prog-prop"]?.["mixer"]?.["_text"]);
        groupArray["encoderId"] = parseInt(eachGroup?.["encStreamId"]?.["_text"]);
        groupArray["decoderId"] = parseInt(eachGroup?.["decStreamId"]?.["_text"]);
        groupArray["_channelCount"] = getChannelCount(groupArray["mixer"], groupArray["encoderId"]);
        groupArray["connections"] = [];

        let rxCount = 1;
        let txCount = 1;
        let index = 0;

        // make sure connections is an array
        const groupConnections = ensureArray(eachGroup?.["Connection"]);

        // loop through connections and pull out the things we want
        for (const eachConnection of groupConnections) {
            const connectionArray = {};
            connectionArray["index"] = index;
            connectionArray["id"] = eachConnection?.["_attributes"]?.["cxn-id"];
            connectionArray["userId"] = eachConnection?.["_attributes"]?.["user-id"];
            connectionArray["name"] = eachConnection?.["name"]?.["_text"];
            connectionArray["cxnOrder"] = parseInt(eachConnection?.["_attributes"]?.["cxn-order"]);
            connectionArray["direction"] = eachConnection?.["direction"]?.["_text"];
            connectionArray["autoReconnect"] = eachConnection?.["autoReconnect"]?.["_text"] === "true";
            connectionArray["transport"] = eachConnection?.["config"]?.["TRANSPORT"]?.["_text"];
            connectionArray["sessionType"] = eachConnection?.["config"]?.["SESSION_TYPE"]?.["_text"];
            connectionArray["encodeDecodeMask"] = eachConnection?.["config"]?.["ENCODE_DECODE_MASK"]?.["_text"];
            if (connectionArray["direction"] === "outbound") {
                connectionArray["_tabName"] = `TX${txCount}`;
                txCount += 1;
            } else {
                connectionArray["_tabName"] = `RX${txCount}`;
                rxCount += 1;
            }

            // for outbound connections, all data is stored in the 'endpoints' node
            if (eachConnection["endpoints"]) {
                const connectionEndpoints = ensureArray(eachConnection?.["endpoints"]);
                if (connectionEndpoints.length > 0) {
                    connectionArray["destination"] = connectionEndpoints[0]?.["DESTINATION"]?.["_text"];
                    connectionArray["sessionPort"] = connectionEndpoints[0]?.["SESSION_PORT"]?.["_text"];
                    connectionArray["audioPort"] = connectionEndpoints[0]?.["AUDIO_PORT"]?.["_text"];
                    connectionArray["sipAccount"] = connectionEndpoints[0]?.["sipAccount"]?.["_text"];
                    connectionArray["via"] = connectionEndpoints[0]?.["via"]["_text"];
                    // add the handle - used for matching active connections in loadedProgram
                    connectionArray["cxnHandle"] = connectionEndpoints[0]?.["_attributes"]?.["cxn-handle"];
                }
            }

            // for inbound connections, all data is stored in the 'match' node
            if (eachConnection["match"]) {
                connectionArray["transport"] = eachConnection?.["match"]?.["TRANSPORT"]?.["_text"];
                connectionArray["sessionType"] = eachConnection?.["match"]?.["SESSION_TYPE"]?.["_text"];
                connectionArray["audioPort"] = eachConnection?.["match"]?.["AUDIO_PORT"]?.["_text"];
            }

            groupArray["_hasMultiTx"] = txCount > 2;
            groupArray["connections"].push(connectionArray);
            index += 1;
        }

        program["groups"].push(groupArray);
    }
    return program;
};
