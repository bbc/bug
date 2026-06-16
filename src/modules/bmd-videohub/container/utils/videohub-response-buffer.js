"use strict";

const events = require("events");
const util = require("util");

module.exports = ResponseBuffer;

function ResponseBuffer(socket) {
    this.socket = socket;
    this.buffer = "";
    this.listeners = [];
    this.setupDataHandler();
}

util.inherits(ResponseBuffer, events.EventEmitter);

ResponseBuffer.prototype.setupDataHandler = function () {
    const instance = this;
    this.socket.on("data", function (data) {
        instance.buffer += data.toString();
        instance.processBuffer();
    });
};

ResponseBuffer.prototype.processBuffer = function () {
    let blockEnd = this.buffer.indexOf("\n\n");
    while (blockEnd !== -1) {
        const blockText = this.buffer.substring(0, blockEnd).trim();
        this.buffer = this.buffer.substring(blockEnd + 2);

        if (blockText) {
            try {
                const block = this.parseBlock(blockText);
                if (block) {
                    this.emit("block", block);
                }
            } catch (error) {
                this.emit("error", new Error(`Failed to parse block: ${error.message}`));
            }
        }

        blockEnd = this.buffer.indexOf("\n\n");
    }
};

ResponseBuffer.prototype.parseBlock = function (blockText) {
    const lines = blockText.split("\n");
    if (lines.length === 0) return null;

    // Check for ACK
    if (lines[0].trim() === "ACK") {
        return {
            title: "ack",
            data: {},
        };
    }

    // Check for titled block
    let blockTitle = null;
    let blockData = {};
    let startIdx = 0;

    if (lines[0].endsWith(":")) {
        blockTitle = this.normalizeTitle(lines[0]);
        startIdx = 1;
    }

    if (!blockTitle) return null;

    for (let i = startIdx; i < lines.length; i++) {
        const eachLine = lines[i];
        if (!eachLine.trim()) continue;

        const eachLineSpaceArray = eachLine.split(" ");
        if (!isNaN(eachLineSpaceArray[0])) {
            blockData[parseInt(eachLineSpaceArray[0])] = eachLine.substring(eachLine.indexOf(" ") + 1);
        } else {
            const eachLineColonArray = eachLine.split(":");
            if (eachLineColonArray.length === 2) {
                const lowerName = eachLineColonArray[0].toLowerCase().replace(/\ /g, "_").trim();
                blockData[lowerName] = eachLineColonArray[1].trim();
            }
        }
    }

    return {
        title: blockTitle,
        data: blockData,
    };
};

ResponseBuffer.prototype.normalizeTitle = function (title) {
    return title
        .toLowerCase()
        .replace(/:/g, "")
        .replace(/\ /g, "_")
        .trim();
};

ResponseBuffer.prototype.close = function () {
    this.socket.removeAllListeners("data");
};
