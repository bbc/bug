const influxClient = require("./influx-client");

module.exports = async (filters = {}, startTime = null, endTime = null) => {
    const queryApi = influxClient.getQueryApi();
    const bucket = "bug";

    if (!startTime) {
        startTime = "-10m";
    }

    if (!endTime) {
        endTime = Date.now();
    }

    let queryArray = [`from(bucket: "${bucket}")`, `range(start: ${startTime}, stop: ${endTime})`];
    for (const [filterKey, filterValue] of Object.entries(filters)) {
        if (Array.isArray(filterValue)) {
            let fieldArray = [];
            for (let eachFilterValue of filterValue) {
                fieldArray.push(`r["${filterKey}"] == "${eachFilterValue}"`);
            }
            queryArray.push(`filter(fn: (r) => ${fieldArray.join(` or `)})`);
        } else {
            queryArray.push(`filter(fn: (r) => r["${filterKey}"] == "${filterValue}")`);
        }
    }

    const query = queryArray.join(" |> ");

    return await queryApi.collectRows(query);
};
