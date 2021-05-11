const influxClient = require("./influx-client");
const { Point } = require("@influxdata/influxdb-client");

module.exports = async (measurementName, dataField, dataValue, tags = []) => {
    const writeApi = influxClient.getWriteApi();

    const point = new Point(measurementName).floatField(dataField, dataValue).tag(tags).timestamp(new Date());

    writeApi.writePoint(point);
    writeApi
        .close()
        .then(() => {
            console.log("FINISHED");
        })
        .catch((e) => {
            console.error(e);
            console.log("\\nFinished ERROR");
        });
};
