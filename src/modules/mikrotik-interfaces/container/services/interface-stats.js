// const influxGet = require("@utils/influx-get");
const mongoCollection = require("../utils/mongo-collection");

module.exports = async (interfaceName, startTime = null, endTime = null) => {
    try {
        if (endTime === null) {
            endTime = Date.now();
        }

        if (startTime === null) {
            startTime = endTime - (60 * 10 * 1000); // 10 mins
        }

        const historyCollection = await mongoCollection("history");

        let history = await historyCollection.find({ timestamp: { $gte: startTime, $lte: endTime } }).toArray();

        let interfaceStatsArray = {
            tx: [],
            rx: [],
        };

        for(let eachItem of history) {
            if(eachItem['interfaces'][interfaceName]) {
                interfaceStatsArray['tx'].push({
                    x: eachItem['timestamp'],
                    y: eachItem['interfaces'][interfaceName]['tx']
                });
                interfaceStatsArray['rx'].push({
                    x: eachItem['timestamp'],
                    y: eachItem['interfaces'][interfaceName]['rx']
                });
            }
        }
        return interfaceStatsArray;

    } catch (error) {}
};
