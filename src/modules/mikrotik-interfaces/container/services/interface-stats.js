const influxGet = require("@utils/influx-get");

module.exports = async (interfaceName, statisticField) => {
    try {
        const influxRows = await influxGet({
            _measurement: "traffic",
            interface: interfaceName,
            _field: ["rx-bits-per-second", "tx-bits-per-second"],
        });

        if (!influxRows) {
            return false;
        }

        let interfaceStatsArray = {
            tx: [],
            rx: [],
        };

        for (let eachRow of influxRows) {
            var rowDate = new Date(eachRow["_time"]);

            var type = eachRow._field === "rx-bits-per-second" ? "rx" : "tx";
            interfaceStatsArray[type].push({
                x: rowDate.getTime(),
                y: eachRow["_value"],
            });
        }

        return interfaceStatsArray;
    } catch (error) {}
};
