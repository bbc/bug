"use strict";

exports.outputList = function (statusObj) {
    if (!statusObj) return [];

    var list = statusObj.output_labels.map(function (label, index) {
        var obj = {
            outputConnector: index,
            outputLabel: label,
            inputConnector: parseInt(statusObj.video_output_routing[index], 10),
            locked: statusObj.video_output_locks[index] == "U" ? false : true,
        };

        obj.inputLabel = statusObj.input_labels[obj.inputConnector];

        return obj;
    });

    return list;
};
