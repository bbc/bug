"use strict";

/**
 *  Expose the parser
 */

module.exports = parser;

var currentBlock = "";

/**
 *  Teh parser
 *  Basically, we need to determine if we have a full block
 *  a full block starts with a line with only full caps letters
 *  a full block is a block that terminates with two new line characters
 */

function parser(str) {
    if (!str) return {};

    var obj = {};

    var hasBeginning = str.match(/[A-Z]+:\n/g);
    var hasStartBeginning = str.match(/^[A-Z][A-Z].|\ [A-Z]:\n/g);
    var hasTerminator = str.match(/\n\n/g);
    var hasEndingTerminator = str.match(/\n\n$/g);

    if (hasBeginning && hasStartBeginning && hasTerminator && hasEndingTerminator) {
        currentBlock = "";
        return selfContained(str);
    }

    // we are done with the current block header
    if (hasTerminator && hasEndingTerminator) {
        currentBlock += str;
        obj = selfContained(currentBlock);
        currentBlock = "";
        return obj;
    }

    currentBlock += str;

    return;
}

/**
 *  Handle a self contained block
 */

function selfContained(str) {
    var arr = str.split(/\n/g).filter(function (key) {
        return !!key;
    });

    var title = normalizeTitle(arr.shift());
    var data = {};
    var array = false;

    var isDictionary = arr.every(function (val) {
        return ~val.indexOf(":");
    });

    arr = arr.map(function (key) {
        if (!key) return;

        var temp;
        var obj = {};

        if (isDictionary) {
            temp = key.split(":").map(function (val) {
                return val.trim();
            });

            obj[temp[0]] = temp[1];
        } else {
            array = true;
            temp = key.match(/(^\d+)\ (.+)/);
            obj[temp[1]] = temp[2];
        }

        for (var key in obj) {
            data[key] = obj[key];
        }
    });

    return {
        title: title,
        data: data,
        array: array,
    };
}

function normalizeTitle(title) {
    return title.toLowerCase().replace(/\ /g, "_").replace(":", "");
}

parser.isNewBlock = function (str) {
    return !!str.match(/([A-Z]|\ )+\:\n/g);
};

parser.getBlockHeader = function (str) {
    str = str.split("\n");
    return str[0].replace(/\ /g, "_").replace(/\:/g, "").toLowerCase();
};

parser.isPreamble = function (str) {
    return ~str.indexOf("PROTOCOL PREAMBLE");
};
