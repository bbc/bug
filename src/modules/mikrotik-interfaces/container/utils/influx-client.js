const { InfluxDB } = require("@influxdata/influxdb-client");

const token = "bug";
const org = "bug";
const bucket = "bug";
const url = "http://bug-influx:8086";

class InfluxDb {
    constructor() {
        this.client = new InfluxDB({ url: url, token: token });
    }

    getWriteApi() {
        return this.client.getWriteApi(org, bucket);
    }
}

module.exports = new InfluxDb();
