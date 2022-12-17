"use strict";

module.exports = (portString) => {
    const returnArray = {
        label: null,
        device: null,
        slot: null,
        port: null,
    };

    const countSlashes = portString.split("/").length - 1;

    if (countSlashes === 2) {
        // it's a stacked switch like Gi1/0/24
        const result = portString.match(/([a-zA-Z]+)(\d+)\/(\d+)\/(\d+)/);
        // parse
        returnArray["label"] = result[1];
        returnArray["device"] = parseInt(result[2]);
        returnArray["slot"] = parseInt(result[3]);
        returnArray["port"] = parseInt(result[4]);
    } else if (countSlashes === 1) {
        // it's a stacked switch like Gi1/24
        const result = portString.match(/([a-zA-Z]+)(\d+)\/(\d+)/);
        // parse
        returnArray["label"] = result[1];
        returnArray["slot"] = parseInt(result[2]);
        returnArray["port"] = parseInt(result[3]);
    } else if (countSlashes == 0) {
        // do the search
        const result = portString.match(/([a-zA-Z]+)(\d+)/);
        // parse
        returnArray["label"] = result[1];
        returnArray["port"] = parseInt(result[2]);
    }

    return returnArray;
};
