"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (hostId, startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - 60 * 5 * 1000; // 5 mins
        }

        const hostsCollection = await mongoCollection("hosts");
        const hostData = await hostsCollection.findOne({ hostId: hostId });

        let pingHistory = [];

        if (hostData.data) {
            pingHistory = hostData.data.filter((item) => {
                if (item.timestamp > startTime && item.timestamp < endTime) {
                    return item;
                }
            });

            pingHistory = pingHistory.map((item) => {
                let itemCopy = Object.assign({}, item);
                for (let key in itemCopy) {
                    if (key !== "timestamp") {
                        if (isNaN(itemCopy[key])) {
                            itemCopy[key] = 0;
                        } else {
                            itemCopy[key] = parseFloat(itemCopy[key]);
                        }
                    } else {
                        itemCopy[key] = new Date(itemCopy[key]).getTime().toFixed(0);
                    }
                }
                return itemCopy;
            });
        }

        return pingHistory;
    } catch (error) {
        console.log(`host-ping-history: ${error.stack || error.trace || error || error.message}`);
    }
};
