const influxClient = require("./influx-client");
const { Point } = require("@influxdata/influxdb-client");

module.exports = async (measurementName, items) => {
    const writeApi = influxClient.getWriteApi();

    for (let eachItem of items) {
        if (typeof eachItem["value"] === "number") {
            try {
                const tags = eachItem["tags"] ? eachItem["tags"] : {};
                const point = new Point(measurementName).floatField(eachItem["field"], eachItem["value"]);

                for (const [key, value] of Object.entries(tags)) {
                    point.tag(key, value);
                }
                writeApi.writePoint(point);
            } catch (error) {
                console.error(`influx-put: ${error.stack || error.trace || error || error.message}`);
            }
        } else {
            console.log(`influx-put: invalid data - ` + JSON.stringify(eachItem));
        }
    }

    try {
        await writeApi.close();
    } catch (error) {
        console.error(`influx-put: ${error.stack || error.trace || error || error.message}`);
    }
};
