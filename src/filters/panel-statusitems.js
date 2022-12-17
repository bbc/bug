"use strict";

module.exports = (statusItems) => {
    // removing the timestamp

    if(statusItems) {
        for(let eachItem of statusItems) {
            delete eachItem.timestamp;
        }
    }

    return statusItems;
};
