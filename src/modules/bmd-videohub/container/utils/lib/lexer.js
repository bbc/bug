"use strict";

var keys = [
    "protocol_preamble",
    "videohub_device",
    "input_labels",
    "output_labels",
    "video_output_locks",
    "video_output_routing",
];

var coloned = [0, 1];

module.exports = lexer;

function lexer(obj) {
    var arr = [];
    var lastKey = "";

    keys.forEach(function (key, index) {
        var str = "";

        if (key == lastKey) str = "\n";

        // todo fix the new line extra space between sections
        str += key.replace(/\_/g, " ").toUpperCase() + ":";

        console.log(str);

        arr.push(str);

        lastKey = key;

        if (coloned.indexOf(index) !== -1) {
            for (var _key in obj[key]) {
                arr.push(_key + ": " + obj[key][_key]);
            }
        } else {
            obj[key].forEach(function (val, index) {
                arr.push(index + " " + obj[key][index]);
            });
        }
    });

    return arr.join("\n") + "\n";
}
